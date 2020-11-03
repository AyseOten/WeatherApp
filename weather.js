window.onload = function () {
    var select = document.getElementById("selectCity");
    var cities = ['Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
        'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
        'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
        'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir',
        'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya',
        'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya',
        'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
        'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak',
        'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce']
    var btn = document.getElementById("btn");
    var inpCityName = document.getElementById("textbox-city");

    var cityName;
    var cityTemp;

    // dinamik olarak olusturduk right icindeki elementleri
    var right = document.getElementById("right-side");

    //today buyuk ve ustte
    var today = document.createElement('div');
    today.className = 'today'; 
    today.id = 'today';
    right.appendChild(today);

    // 4 tane othersday altta ve kücük
    var othersday = document.createElement('div');
    othersday.className = 'othersday';
    othersday.id = 'othersday';  
    right.appendChild(othersday);

    // sıcaklıklar
    var degrees = document.createElement('div');
    degrees.className = 'degrees'; 
    degrees.id = 'degrees'; 
    right.appendChild(degrees);

    // bulutlu, acik, yagmurlu 
    var descriptions = document.createElement('div');
    descriptions.className = 'descriptions'; 
    descriptions.id = 'descriptions'; 
    right.appendChild(descriptions);

    /* selectbox a arraydeki veriler yukleniyor  */
    for (var i = 0; i < cities.length; ++i) {
        var opt = document.createElement('option');
        opt.innerHTML = cities[i];
        opt.value = cities[i];
        select.appendChild(opt);
    }

    //select box tan sehir secince sehrin hava durumu geliyor
    select.addEventListener("change", (event) => {
        console.log('selected: ', event.target.value);
        var city = event.target.value;
        if (city) {
            findWeather(city);
        } else {
            return;
        }
    })

    // sehir adi yazip butona tiklayinca sehrin hava durumu geliyor
    btn.addEventListener('click', function () {
        findWeather(inpCityName.value);
    })


    // verileri api den alan ve yazdiran fonksiyon
    function findWeather(city) {

        today.innerHTML = "";
        othersday.innerHTML = "";
        degrees.innerHTML = "";
        descriptions.innerHTML ="";

        var degree;
        var weather;
        var weatherTurkish;

        console.log('cityName:', inpCityName);

        fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=0e191bfc296a873bae93bbdd559d624a')
            .then(response => response.json())
            .then(data => {
                if (data) {

                    var n = document.createElement("h2");
                    var h2elem = "5 Günlük Hava Durumu (" + city + ")";
                    var h2node = document.createTextNode(h2elem);
                    n.appendChild(h2node);
                    document.getElementById("today").appendChild(n);

                    // sehir adi 
                    cityName = data['city']['name'];
                    console.log('cityName:', cityName); // dogru geliyor

                    for (i = 0; i <= 32; i = i + 8) {
                        cityTemp = data['list'][i].main.temp; // listenin ilk elemanı, bugunun hava durumu
                        console.log('temparature:', cityTemp); // ilk temp degerini donduruyor
                        degree = fahrenheitToKelvin(cityTemp);
                        console.log("temp(degree):", degree);
                        weather = data['list'][i].weather[0].main;  // temel aciklama
                        console.log("weather:", weather);
                        weatherTurkish = convertToTurkish(weather); // turkcesi 
                        console.log("hava:", weatherTurkish);

                        if (i == 0) {
                            addFirstImage(weather);
                            createNode(degree, weatherTurkish, "today", "today");
                        }
                        else {
                            addImage(weather);
                            createNode(degree, weatherTurkish, "degrees", "descriptions");
                        }
                    }
                }
            })
            .catch(err => alert("Şehir adını lütfen doğru giriniz!"))
    }

    // api de kelvindi santigrat a cevirdik
    function fahrenheitToKelvin(cityTemp) {
        newTemp = Math.round(cityTemp - 273.15) + "°C";
        return newTemp;
    }

    // api de ing di turkceye cevirdik
    function convertToTurkish(weather) {
        switch (weather) {
            case "Rain":
                return "Yağmurlu";
            case "Clear":
                return "Açık";
            case "Clouds":
                return "Bulutlu"
            case "Snow":
                return "Kar yağışlı";
        }
    }

    // hava durumuna göre resim ekliyor 
    function addImage(weather) {
        switch (weather) {
            case "Rain":
                var image1 = document.createElement('img');
                image1.src = '/rain.png';
                document.getElementById('othersday').appendChild(image1);
                break;
            case "Clear":
                var image2 = document.createElement('img');
                image2.src = '/clear.png';
                document.getElementById('othersday').appendChild(image2);
                break;
            case "Clouds":
                var image3 = document.createElement('img');
                image3.src = '/clouds.png';
                document.getElementById('othersday').appendChild(image3);
                break;
            case "Snow":
                var image4 = document.createElement('img');
                image4.src = '/snow.png';
                document.getElementById('othersday').appendChild(image4);
                break;
        }
    }

    // ilk resmin boyutlari farklı oldugu icin baska fonks yazdik
    function addFirstImage(weather) {
        switch (weather) {
            case "Rain":
                var image1 = document.createElement('img');
                image1.src = '/rain.png';
                document.getElementById('today').appendChild(image1);
                firstImageSizing(image1);
                break;
            case "Clear":
                var image2 = document.createElement('img');
                image2.src = '/clear.png';
                document.getElementById('today').appendChild(image2);
                firstImageSizing(image2);
                break;
            case "Clouds":
                var image3 = document.createElement('img');
                image3.src = '/clouds.png';
                document.getElementById('today').appendChild(image3);
                firstImageSizing(image3);
                break;
            case "Snow":
                var image4 = document.createElement('img');
                image4.src = '/snow.png';
                document.getElementById('today').appendChild(image4);
                firstImageSizing(image4);
                break;
        }
    }

    // 5 gün icin ayri ayri node olusturuyor
    function createNode(degree, weatherTurkish, div1, div2) {
        var node = document.createElement("span");
        var node2 = document.createElement("span");
        var degreenode = document.createTextNode(degree);
        var descnode = document.createTextNode(weatherTurkish);
        node.appendChild(degreenode);
        node2.appendChild(descnode);
        document.getElementById(div1).appendChild(node);
        document.getElementById(div2).appendChild(node2);
    }

    // today icin image size yapiyor
    function firstImageSizing(img) {
        img.style.width = "150px";
        img.style.height = "150px";

    }
}
