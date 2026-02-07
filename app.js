let todayMood=null;
let selectedSymptoms=[];

// Tabs
function showTab(id, btn){
  document.querySelectorAll('.section').forEach(s=>s.style.display='none');
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).style.display='block';
  btn.classList.add('active');
}

// Mood
function saveMood(val){ todayMood=val; displayMessage(); }

// Symptom
function toggleSymptom(btn,val){
  btn.classList.toggle('active');
  if(selectedSymptoms.includes(val)) selectedSymptoms=selectedSymptoms.filter(s=>s!==val);
  else selectedSymptoms.push(val);
}

// Cycle
function saveCycle(dateStr){
  if(dateStr) localStorage.setItem('lastCycle', dateStr);
}

// Confidence
function getConfidence(){
  const data=JSON.parse(localStorage.getItem("moods")||"[]");
  const cyclesCount=Number(localStorage.getItem("cyclesCount")||0);
  const moodDays=data.length;
  let cycleVariance=2;
  return Math.min(100, cyclesCount*20 + moodDays*2 - cycleVariance*5);
}

// Silence Mode
function checkSilenceMode(){
  const data=JSON.parse(localStorage.getItem("moods")||"[]");
  if(!data.length) return false;
  const lastEntry=data[data.length-1];
  const mood=lastEntry.mood;
  const symptoms=selectedSymptoms;
  const lastDate=new Date(lastEntry.date);
  const diffDays=(new Date()-lastDate)/(1000*60*60*24);
  const confidence=getConfidence();
  if(mood<=2 && (symptoms.includes("خستگی")||symptoms.includes("درد")) && diffDays<=2 && confidence<50) return true;
  return false;
}

// Phase detection
function detectPhase(){ return "pms"; }
function getMessage(phase,mood){
  if(phase==="pms"&&mood<=2) return "امروز بهتره آروم باشی 🤍";
  if(mood>=4) return "حالِ خوبت قشنگه ✨";
  return "همین که هستی، کافیه";
}

// Display message
function displayMessage(){
  const msgEl=document.getElementById("message");
  const silence=checkSilenceMode();
  if(silence){
    msgEl.innerText="من اینجام 🤍، هر وقت خواستی بیا";
    msgEl.style.color="#718096";
  }else{
    msgEl.innerText=todayMood?getMessage(detectPhase(),todayMood):"امروز حالت رو بگو 🤍";
    msgEl.style.color="#0B3D91";
  }
  updateChart();
}

// Confirm Save
function confirmSave(){
  if(todayMood===null) return;
  const data=JSON.parse(localStorage.getItem("moods")||"[]");
  data.push({date:new Date().toISOString().slice(0,10),mood:todayMood});
  localStorage.setItem("moods",JSON.stringify(data));
  localStorage.setItem("savedSymptoms",JSON.stringify(selectedSymptoms));
  displayMessage();
  document.getElementById("message").innerText+=" ✅ ثبت شد غزلیلییی مننن 💙";
}

// Chart
function updateChart(){
  const ctx=document.getElementById("moodChart").getContext("2d");
  const data=JSON.parse(localStorage.getItem("moods")||"[]");
  const labels=data.map(d=>d.date);
  const moods=data.map(d=>d.mood);
  if(window.chart) window.chart.destroy();
  window.chart=new Chart(ctx,{
    type:'line',
    data:{
      labels:labels,
      datasets:[{
        label:'احساس ماهانه',
        data:moods,
        fill:false,
        borderColor:'#0B3D91',
        tension:0.3
      }]
    },
    options:{
      responsive:true,
      scales:{
        y:{min:1,max:5,ticks:{stepSize:1}}
      }
    }
  });
}

window.addEventListener("load",displayMessage);
