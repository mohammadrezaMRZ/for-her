self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",()=>{});

function notify(){
  const data=JSON.parse(localStorage.getItem("moods")||"[]");
  let mood=(data.length?data[data.length-1].mood:3);
  if(mood<=2) return; // Silence Mode → نوتیفیکیشن نمی‌فرستد
  self.registration.showNotification("غزلیلی 💙",{body:"امروز با خودت مهربون باش ✨"});
}
