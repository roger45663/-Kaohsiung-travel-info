(function (global) {
    'use strict';
    // 全域變數
    // 初始化要顯示第幾個陣列的資料
    let nowIndex = 0;
    // 防止資料不斷讀取
    let isLoading = false;
    // 資料網址
    const url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
    // 全部JSON資料
    let allData = [];
    // 每8筆資料放入一個陣列中，配合 scroll 增加要渲染的資料
    let pageData = [];

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
    const pageRendering = document.querySelector('.pagination ul');

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

    // 資料讀取狀態判定
    (function () {
        xhr.onload = function () {
            // 如果有成功抓取到JSON資料，就會將資料存到 allData 中
            // 並將資料丟給 getData，這個函式進行陣列排序
            if (xhr.readyState === 4 && xhr.status === 200) {
                let parseData = JSON.parse(xhr.responseText);
                allData = parseData.result.records;
                getData(allData);
            } else {
                // 讀取失敗會顯示錯誤
                alert('資料讀取錯誤!!!')
            }
        }
    })();

    // 取得資料，並將資料依筆數丟入所屬陣列中
    function getData(item) {
        let len = item.length;
        // 資料暫存區
        let page = [];
        nowIndex = 0;

        // 依序將資料塞入暫存區
        for(let i=0; i<len; i++) {
            page.push(item[i]);

            // 如果暫存區資料有8筆，就將資料塞到 pageData 裡
            if(page.length === 8) {
                pageData.push(page);
                page = [];
            }
        }

        // 如果剩餘的資料不到8筆，只要有資料一樣塞入 pageData 裡
        if(page.length>0) {
            pageData.push(page);
        }
        
        rendering();
        // pagination();
    }

    // 頁面渲染
    function rendering() {
        // 判斷是否有這個陣列
        if(!pageData[nowIndex]) {
            return;
        }
        let pageLen = pageData[nowIndex].length;

        // 取得陣列中的資料，並進行渲染
        for (let j = 0; j < pageLen; j++) {
            let el = document.createElement('div');
            el.classList.add('col');
            el.setAttribute("data-name", `${pageData[nowIndex][j].Name}`);
            if (pageData[nowIndex][j].Ticketinfo === '免費參觀') {
                el.innerHTML += `
                    <div class="top" data-name="${pageData[nowIndex][j].Name}" style="background: url(${pageData[nowIndex][j].Picture1})">
                        <h3 class="place_name" data-name="${pageData[nowIndex][j].Name}">${pageData[nowIndex][j].Name}</h3>
                        <p class="area_name" data-name="${pageData[nowIndex][j].Name}">${pageData[nowIndex][j].Zone}</p>
                    </div>
                    <div class="bottom" data-name="${pageData[nowIndex][j].Name}">
                        <ul class="info" data-name="${pageData[nowIndex][j].Name}">
                            <li data-name="${pageData[nowIndex][j].Name}"><i class="fas fa-clock"></i><span>開放時間: </span>${pageData[nowIndex][j].Opentime}</li>
                            <li data-name="${pageData[nowIndex][j].Name}"><i class="fas fa-map-marker-alt"></i><span>地址: </span>${pageData[nowIndex][j].Add}</li>
                            <li data-name="${pageData[nowIndex][j].Name}"><i class="fas fa-phone"></i><span>電話: </span>${pageData[nowIndex][j].Tel}</li>
                        </ul>
                        <div class="free_info" data-name="${pageData[nowIndex][j].Name}"><i class="fas fa-backspace"></i>${pageData[nowIndex][j].Ticketinfo}</div>
                    </div>
                `;
            }else {
                el.innerHTML += `
                    <div class="top" data-name="${pageData[nowIndex][j].Name}" style="background: url(${pageData[nowIndex][j].Picture1})">
                        <h3 class="place_name" data-name="${pageData[nowIndex][j].Name}">${pageData[nowIndex][j].Name}</h3>
                        <p class="area_name" data-name="${pageData[nowIndex][j].Name}">${pageData[nowIndex][j].Zone}</p>
                    </div>
                    <div class="bottom" data-name="${pageData[nowIndex][j].Name}">
                        <ul class="info" data-name="${pageData[nowIndex][j].Name}">
                            <li data-name="${pageData[nowIndex][j].Name}"><i class="fas fa-clock"></i><span>開放時間: </span>${pageData[nowIndex][j].Opentime}</li>
                            <li data-name="${pageData[nowIndex][j].Name}"><i class="fas fa-map-marker-alt"></i><span>地址: </span>${pageData[nowIndex][j].Add}</li>
                            <li data-name="${pageData[nowIndex][j].Name}"><i class="fas fa-phone"></i><span>電話: </span>${pageData[nowIndex][j].Tel}</li>
                        </ul>
                    </div>
                `;
            }
            showData.appendChild(el);
        }

        // 判斷是否需要塞入 placeholder
        if (pageLen % 2 === 1 && pageData[nowIndex] === pageData[pageData.length - 1] && window.innerWidth > 768) {
            let placeholder = document.createElement('div');
            placeholder.classList.add('col');
            placeholder.style.opacity = 0;
            placeholder.style.cursor = 'default';
            placeholder.innerHTML += `
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
            `;
            showData.appendChild(placeholder);
        }
    }

    // 選單比對資料進行頁面渲染
    function changeArea(e) {
        showData.innerHTML = '';
        pageData = [];
        let selectName = e.target.value;
        title.innerHTML = selectName;
        let comparison = [];
        for (let i = 0; i < allData.length; i++) {
            if (selectName === allData[i].Zone) {
                comparison.push(allData[i]);
            }
        }

        if(pageData) {
            getData(comparison);
        }
        
    };

    // 熱門地區比對
    function hotZone(e) {
        e.preventDefault();
        showData.innerHTML = '';
        pageData = [];
        let zoneArr = [];
        title.innerHTML = e.target.textContent;
        for (let i = 0; i < allData.length; i++) {
            if (e.target.textContent === allData[i].Zone) {
                zoneArr.push(allData[i]);
            }
        }

        if(zoneArr) {
            getData(zoneArr);
        }
    }

    // 渲染 modal
    function showModal(e) {
        if (e.target === showData) { return; }
        let placeName = e.target.dataset.name;
        let modalData = [];
        let str = '';
        modal.classList.add('showModal');
        for (let i = 0; i < allData.length; i++) {
            if (placeName === allData[i].Name && placeName) {
                str += `
                    <div id="modal">
                        <div class="modal_top" style="background: url(${allData[i].Picture1})">
                            <h4>${allData[i].Name}</h4>
                        </div>

                        <div class="modal_content">
                            <h5>簡介</h5>
                            <p>${allData[i].Description}</p>
                            <hr>
                            <h5>Google Map</h5>
                            <div id="google_map">
                                <div id="map"></div>
                            </div>
                        </div>

                        <div class="modal_footer">
                            <a href="#" class="btn_close">關閉</a>
                            <h6>上一次更新時間：${allData[i].Changetime}</h6>
                        </div>
                `;
                modalData.push(allData[i]);
            }
        }
        modal.innerHTML = str;
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
        var myLatlng = { lat: Number(mapData.Py), lng: Number(mapData.Px) };

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

    // infinite scroll
    function infinteScroll() {
        // 瀏覽器滾輪和頁面頂部之間的距離
        let scrollHeight = document.documentElement.scrollTop;
        // 所見畫面視窗的高度
        let windowInnerHeight = window.innerHeight;
        // 實際頁面總高
        let totalHeight = document.documentElement.scrollHeight;
        // 判斷頁面滑到快底部時，及觸發裡面的程式
        if (scrollHeight + windowInnerHeight >= totalHeight - 200) {
            if (!isLoading) {
                nowIndex++;
                rendering();
            }
        }
    }
    

    // pagination
    // function pagination() {
    //     let pageNum = pageData.length;
    //     let paginationTemplate = '';

    //     if(pageNum >= 2) {
    //         paginationTemplate += '<li><a href="#">&lt; prev</a></li>';

    //         for(let i=0; i<pageNum; i++) {
    //             paginationTemplate += `
    //                 <li><a href="#">${i+1}</a></li>
    //             `
    //         }

    //         paginationTemplate += '<li><a href="#">next &gt;</a></li>';
    //     }
    //     pageRendering.innerHTML = paginationTemplate;
    // }

    // function changePage(e) {
    //     e.preventDefault();
    //     showData.innerHTML = '';
    //     let num = Number(e.target.textContent);
    //     console.log(num);

    //     rendering(pageData[num-1]);
        
    // }


    // 事件監聽
    areaSelect.addEventListener('change', changeArea);
    showData.addEventListener('click', showModal);
    hotArea.addEventListener('click', hotZone);
    window.addEventListener('scroll', infinteScroll);
    // pageRendering.addEventListener('click', changePage);

}(window));