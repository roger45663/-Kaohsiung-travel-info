(function (global, jQuery) {
    'use strict';
    // 全域變數
    // 資料網址
    const url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
    // 全部JSON資料
    let data;

    // 取得opendata JSON資料
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.send(null);

    // DOM取得
    const areaSelect = document.querySelector('#choose_area');
    const showData = document.querySelector('.row');
    const modal = document.querySelector('#modal_bg');
    const hotArea = document.querySelector('.btn_group');
    const title = document.querySelector('.area_title');
    const pagination = document.querySelector('.pagination');

    // 高雄地區資料
    const areaName = ['楠梓區', '左營區', '鼓山區', '三民區', '苓雅區', '新興區', '前金區', '鹽埕區', '前鎮區', '旗津區', '小港區', '鳳山區', '茂林區', '甲仙區', '六龜區', '杉林區', '美濃區', '內門區', '仁武區', '田寮區', '旗山區', '梓官區', '阿蓮區', '湖內區', '岡山區', '茄萣區', '路竹區', '鳥松區', '永安區', '燕巢區', '大樹區', '大寮區', '林園區', '彌陀區', '橋頭區', '大社區', '那瑪夏區', '桃源區'];

    // 新增選單區域
    (function (data) {
        let areaLen = data.length;
        for (let i = 0; i < areaLen; i++) {
            let option = document.createElement('option');
            option.setAttribute('value', data[i]);
            option.textContent = data[i];
            areaSelect.appendChild(option);
        }
    }(areaName));
    
    // 資料讀取完進行頁面渲染
    (function () {
        xhr.onload = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                let parseData = JSON.parse(xhr.responseText);
                data = parseData.result.records;
                rendering(data);
            }else {
                alert('資料讀取錯誤!!!')
            }
        }
    })();

    // 頁面渲染
    function rendering(item) {
        let dataLen = item.length;
        let str = '';

        for (let i = 0; i < dataLen; i++) {
            if (item[i].Ticketinfo === '免費參觀') {
                str += `<div class="col" data-name="${item[i].Name}">
                                <div class="top" data-name="${item[i].Name}" style="background: url(${data[i].Picture1})">
                                    <h3 class="place_name" data-name="${item[i].Name}">${data[i].Name}</h3>
                                    <p class="area_name" data-name="${item[i].Name}">${data[i].Zone}</p>
                                </div>
                                <div class="bottom" data-name="${item[i].Name}">
                                    <ul class="info" data-name="${item[i].Name}">
                                        <li data-name="${item[i].Name}"><i class="fas fa-clock"></i><span>開放時間: </span>${data[i].Opentime}</li>
                                        <li data-name="${item[i].Name}"><i class="fas fa-map-marker-alt"></i><span>地址: </span>${data[i].Add}</li>
                                        <li data-name="${item[i].Name}"><i class="fas fa-phone"></i><span>電話: </span>${data[i].Tel}</li>
                                    </ul>
                                    <div class="free_info" data-name="${item[i].Name}"><i class="fas fa-backspace"></i>${data[i].Ticketinfo}</div>
                                </div>
                            </div>
                            `
            } else {
                str += `<div class="col" data-name="${item[i].Name}">
                                <div class="top" data-name="${item[i].Name}" style="background: url(${item[i].Picture1})">
                                    <h3 class="place_name" data-name="${item[i].Name}">${item[i].Name}</h3>
                                    <p class="area_name" data-name="${item[i].Name}">${item[i].Zone}</p>
                                </div>
                                <div class="bottom" data-name="${item[i].Name}">
                                    <ul class="info" data-name="${item[i].Name}">
                                        <li data-name="${item[i].Name}"><i class="fas fa-clock"></i><span>開放時間: </span>${item[i].Opentime}</li>
                                        <li data-name="${item[i].Name}"><i class="fas fa-map-marker-alt"></i><span>地址: </span>${item[i].Add}</li>
                                        <li data-name="${item[i].Name}"><i class="fas fa-phone"></i><span>電話: </span>${item[i].Tel}</li>
                                    </ul>
                                </div>
                            </div>
                            `
            }

        }
        str += `
            <div class="col" style="opacity: 0; cursor: default;">
                <div class="top">
                    <h3 class="place_name">有夠讚農舍</h3>
                    <p class="area_name">淡水區</p>
                </div>
                <div class="bottom">
                    <ul class="info">
                        <li><i class="fas fa-clock"></i><span>開放時間: </span>08:10~17:00 (假日)、09:10~17:00 (平日)</li>
                        <li><i class="fas fa-map-marker-alt"></i><span>地址: </span>台南市大內區二溪里唭子瓦 60 號</li>
                        <li><i class="fas fa-phone"></i><span>電話: </span>06-5760121~3</li>
                    </ul>
                </div>
            </div>
        `;

        showData.innerHTML = str;
    }

    // 選單比對資料進行頁面渲染
    function changeArea(e) {
        let selectName = e.target.value;
        title.innerHTML = selectName;
        let comparison = [];
        for(let i=0; i<data.length; i++) {
            if (selectName === data[i].Zone) {
                comparison.push(data[i]);
            }
        }
        rendering(comparison);
    };

    // 熱門地區比對
    function hotZone(e) {
        let zoneArr = [];
        title.innerHTML = e.target.textContent;
        for(let i=0; i<data.length; i++) {
            if (e.target.textContent === data[i].Zone) {
                zoneArr.push(data[i]);
            }
        }
        rendering(zoneArr);
    }

    // 渲染 modal
    function showModal(e) {
        if(e.target === showData) { return;}
        let placeName = e.target.dataset.name;
        let modalData = [];
        let str = '';
        modal.classList.add('showModal');
        for(let i=0; i<data.length; i++) {
            if(placeName === data[i].Name) {
                str += `
                    <div id="modal">
                        <div class="modal_top" style="background: url(${data[i].Picture1})">
                            <h4>${data[i].Name}</h4>
                        </div>

                        <div class="modal_content">
                            <h5>簡介</h5>
                            <p>${data[i].Description}</p>
                            <hr>
                            <h5>Google Map</h5>
                            <div id="google_map">
                                <div id="map"></div>
                            </div>
                        </div>

                        <div class="modal_footer">
                            <a href="#" class="btn_close">關閉</a>
                            <h6>上一次更新時間：${data[i].Changetime}</h6>
                        </div>
                `;
                modalData.push(data[i]);
            }
        }
        modal.innerHTML = str;
        console.log(modalData);
        initMap(modalData);

        const closeBtn = document.querySelector('.btn_close');
        // 關閉modal
        function closeModal(e) {
            e.preventDefault();
            modal.classList.remove('showModal');
        }
        closeBtn.addEventListener('click', closeModal);
    }

    // google map API 載入
    function initMap(item) {
        let mapData = item[0];
        var myLatlng = { lat: Number(mapData.Py) , lng: Number(mapData.Px) };

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: myLatlng
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Click to zoom'
        });

        map.addListener('center_changed', function () {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            global.setTimeout(function () {
                map.panTo(marker.getPosition());
            }, 3000);
        });

        marker.addListener('click', function () {
            map.setZoom(8);
            map.setCenter(marker.getPosition());
        });
    };

    
    

    // 事件監聽
    areaSelect.addEventListener('change', changeArea);
    showData.addEventListener('click', showModal);
    hotArea.addEventListener('click', hotZone);

}(window, window.jQuery));