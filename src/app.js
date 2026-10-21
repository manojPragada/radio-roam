import { stations, filterStations, streamURL, loadFavorites, loadLastStation, chooseStation, toggleFavorite, mediaErrorMessage } from './model.js';
const $=selector=>document.querySelector(selector);
let selected=stations[0],favorites=[];
try{favorites=loadFavorites(localStorage.getItem('radio-roam-favorites'));}catch{}
try{selected=loadLastStation(localStorage.getItem('radio-roam-last-station'));}catch{}
function render(){
  const items=filterStations($('#search').value).filter(station=>!$('#saved-only').checked||favorites.includes(station.id));
  selected=chooseStation(items,selected?.id);$('#empty').hidden=items.length>0;$('#list').replaceChildren();$('#markers').replaceChildren();
  for(const station of items){
    const button=document.createElement('button');button.dataset.station=station.id;button.textContent=(favorites.includes(station.id)?'★ ':'')+station.city;
    button.setAttribute('aria-pressed',String(station===selected));button.addEventListener('click',()=>{
      selected=station;try{localStorage.setItem('radio-roam-last-station',selected.id);}catch{}render();[...$('#list').children].find(button=>button.dataset.station===selected?.id)?.focus();
    });$('#list').append(button);
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',(station.lon+180)/360*800);dot.setAttribute('cy',(90-station.lat)/180*400);dot.setAttribute('r',station===selected?8:4);dot.setAttribute('class','marker');$('#markers').append(dot);
  }
  $('#name').textContent=selected?.name??'No matching cities';$('#genre').textContent=selected?selected.genre+' · fictional station':'Change your search or turn off the saved filter.';
  const saved=selected&&favorites.includes(selected.id);$('#favorite').disabled=!selected;$('#favorite').textContent=saved?'★ Saved':'Save favorite';$('#favorite').setAttribute('aria-pressed',String(Boolean(saved)));
}
$('#search').addEventListener('input',render);$('#saved-only').addEventListener('change',render);
$('#favorite').addEventListener('click',()=>{
  if(!selected)return;favorites=toggleFavorite(favorites,selected.id);
  try{localStorage.setItem('radio-roam-favorites',JSON.stringify(favorites));}catch{$('#status').textContent='Favorites available for this session only.';}
  render();
});
const audio=$('#audio');let generation=0,watchdog=null;
function clearWatchdog(){if(watchdog!==null)clearTimeout(watchdog);watchdog=null;}
function halt(message='Playback stopped.'){
  generation++;clearWatchdog();audio.pause();audio.removeAttribute('src');audio.load();$('#status').textContent=message;
}
function armWatchdog(){
  clearWatchdog();const current=generation;
  watchdog=setTimeout(()=>{if(current===generation)halt('Connection or buffering timed out after 15 seconds. Try another direct stream.');},15000);
}
$('#stream-form').addEventListener('submit',async event=>{
  event.preventDefault();const url=streamURL($('#stream').value);
  if(!url){$('#status').textContent='Use a direct HTTPS URL without embedded credentials.';return;}
  halt('Connecting to your supplied stream…');const current=generation;audio.src=url;armWatchdog();
  try{await audio.play();if(current===generation){clearWatchdog();$('#status').textContent='Playing your supplied stream, independently of the fictional city selection.';}}
  catch{if(current===generation)halt('Unable to play. Check the URL, browser permission, codec or network.');}
});
$('#stop').addEventListener('click',()=>halt());
audio.addEventListener('error',()=>{if(audio.getAttribute('src'))halt(mediaErrorMessage(audio.error?.code));});
audio.addEventListener('waiting',()=>{if(audio.getAttribute('src')){$('#status').textContent='Buffering your stream…';armWatchdog();}});
audio.addEventListener('playing',()=>{if(audio.getAttribute('src')&&!audio.paused){clearWatchdog();$('#status').textContent='Playing your supplied stream.';}});
audio.addEventListener('pause',()=>{if(audio.getAttribute('src')&&audio.paused&&(audio.currentTime>0||audio.readyState>=2)){clearWatchdog();$('#status').textContent='Stream paused. Resume with the audio controls.';}});
audio.addEventListener('ended',()=>{clearWatchdog();if(audio.getAttribute('src'))$('#status').textContent='Stream ended.';});
window.addEventListener('pagehide',()=>halt());render();


