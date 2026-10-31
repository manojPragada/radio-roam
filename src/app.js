import { stations, filterStations, streamURL, streamFormatHint, capabilitySummary, attemptLabel, favoritesLabel, visibleFavoritesLabel, loadFavorites, loadLastStation, chooseStation, toggleFavorite, clearFavorites, favoriteExport, favoriteImport, mediaErrorMessage, stationIndexForKey } from './model.js';
const $=selector=>document.querySelector(selector);
let selected=stations[0],favorites=[];
try{favorites=loadFavorites(localStorage.getItem('radio-roam-favorites'));}catch{}
try{selected=loadLastStation(localStorage.getItem('radio-roam-last-station'));}catch{}
function render(){
  const items=filterStations($('#search').value).filter(station=>!$('#saved-only').checked||favorites.includes(station.id));
  selected=chooseStation(items,selected?.id);$('#empty').hidden=items.length>0;$('#list').replaceChildren();$('#markers').replaceChildren();
  for(const station of items){
    const button=document.createElement('button');button.dataset.station=station.id;button.textContent=(favorites.includes(station.id)?'★ ':'')+station.city;
    button.setAttribute('aria-pressed',String(station===selected));button.addEventListener('keydown',event=>{
      const buttons=[...$('#list').children],next=stationIndexForKey(buttons.indexOf(button),buttons.length,event.key);
      if(next!==buttons.indexOf(button)){event.preventDefault();buttons[next].focus();}
    });button.addEventListener('click',()=>{
      selected=station;try{localStorage.setItem('radio-roam-last-station',selected.id);}catch{}render();[...$('#list').children].find(button=>button.dataset.station===selected?.id)?.focus();
    });$('#list').append(button);
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',(station.lon+180)/360*800);dot.setAttribute('cy',(90-station.lat)/180*400);dot.setAttribute('r',station===selected?8:4);dot.setAttribute('class','marker');$('#markers').append(dot);
  }
  $('#name').textContent=selected?.name??'No matching cities';$('#genre').textContent=selected?selected.genre+' · fictional station':'Change your search or turn off the saved filter.';
  let summary=$('#favorites-summary');if(!summary){summary=document.createElement('p');summary.id='favorites-summary';summary.className='small muted';summary.setAttribute('aria-live','polite');$('#favorite').after(summary);}summary.textContent=`${favoritesLabel(favorites)} · ${visibleFavoritesLabel(items,favorites)}`;const saved=selected&&favorites.includes(selected.id);$('#favorite').disabled=!selected;$('#favorite').textContent=saved?'★ Saved':'Save favorite';$('#favorite').setAttribute('aria-pressed',String(Boolean(saved)));
}
$('#search').addEventListener('input',render);$('#saved-only').addEventListener('change',render);
$('#favorite').addEventListener('click',()=>{
  if(!selected)return;favorites=toggleFavorite(favorites,selected.id);
  try{localStorage.setItem('radio-roam-favorites',JSON.stringify(favorites));}catch{$('#status').textContent='Favorites available for this session only.';}
  render();
});
const clearSaved=document.createElement('button');clearSaved.id='clear-saved';clearSaved.type='button';clearSaved.textContent='Clear saved';$('#favorite').after(clearSaved);clearSaved.addEventListener('click',()=>{favorites=clearFavorites();try{localStorage.removeItem('radio-roam-favorites');}catch{}$('#status').textContent='All locally saved fictional stations cleared.';render();});
const exportSaved=document.createElement('button');exportSaved.id='export-saved';exportSaved.type='button';exportSaved.textContent='Export saved';clearSaved.after(exportSaved);exportSaved.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(favoriteExport(favorites),null,2)],{type:'application/json'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='radio-roam-favorites.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),0);$('#status').textContent='Exported fictional station metadata only; stream URLs were not included.';});
const importInput=document.createElement('input');importInput.type='file';importInput.accept='application/json,.json';importInput.hidden=true;importInput.id='import-saved-file';const importSaved=document.createElement('button');importSaved.type='button';importSaved.id='import-saved';importSaved.textContent='Import saved';exportSaved.after(importSaved,importInput);importSaved.addEventListener('click',()=>importInput.click());importInput.addEventListener('change',async()=>{const file=importInput.files?.[0];importInput.value='';if(!file)return;if(file.size>32768){$('#status').textContent='Favorites file must be 32 KiB or smaller.';return;}try{favorites=favoriteImport(JSON.parse(await file.text()));let stored=true;try{localStorage.setItem('radio-roam-favorites',JSON.stringify(favorites));}catch{stored=false;}$('#status').textContent=`Imported ${favorites.length} validated fictional favorites; no stream URLs were read.${stored?'':' Saved for this session only.'}`;render();}catch{$('#status').textContent='Could not import this Radio Roam favorites file.';}});
const audio=$('#audio');let generation=0,watchdog=null,lastStream=null,attempts=0;
const formatHint=document.createElement('p');formatHint.id='format-hint';formatHint.className='small muted';formatHint.setAttribute('aria-live','polite');$('#stream').after(formatHint);
const capability=document.createElement('p');capability.id='capability';capability.className='small muted';capability.textContent=capabilitySummary(mime=>audio.canPlayType(mime));formatHint.after(capability);
const attemptStatus=document.createElement('p');attemptStatus.id='attempt-status';attemptStatus.className='small muted';attemptStatus.textContent=attemptLabel(0);capability.after(attemptStatus);
function updateFormatHint(){formatHint.textContent=streamFormatHint($('#stream').value);}$('#stream').addEventListener('input',updateFormatHint);updateFormatHint();
const retry=document.createElement('button');retry.id='retry';retry.type='button';retry.textContent='Retry last stream';retry.disabled=true;$('#stop').after(retry);
function clearWatchdog(){if(watchdog!==null)clearTimeout(watchdog);watchdog=null;}
function halt(message='Playback stopped.'){
  generation++;clearWatchdog();audio.pause();audio.removeAttribute('src');audio.load();$('#status').textContent=message;
}
function armWatchdog(){
  clearWatchdog();const current=generation;
  watchdog=setTimeout(()=>{if(current===generation)halt('Connection or buffering timed out after 15 seconds. Try another direct stream.');},15000);
}
async function playStream(url){
  halt('Connecting to your supplied stream…');attemptStatus.textContent=attemptLabel(++attempts);const current=generation;audio.src=url;armWatchdog();
  try{await audio.play();if(current===generation){clearWatchdog();$('#status').textContent='Playing your supplied stream, independently of the fictional city selection.';}}
  catch{if(current===generation)halt('Unable to play. Check the URL, browser permission, codec or network.');}
}
$('#stream-form').addEventListener('submit',async event=>{
  event.preventDefault();updateFormatHint();const url=streamURL($('#stream').value);
  if(!url){$('#status').textContent='Use a direct HTTPS URL without embedded credentials.';return;}
  lastStream=url;retry.disabled=false;await playStream(url);
});
retry.addEventListener('click',()=>{if(lastStream)playStream(lastStream);});
$('#stop').addEventListener('click',()=>halt());
audio.addEventListener('error',()=>{if(audio.getAttribute('src'))halt(mediaErrorMessage(audio.error?.code));});
audio.addEventListener('waiting',()=>{if(audio.getAttribute('src')){$('#status').textContent='Buffering your stream…';armWatchdog();}});
audio.addEventListener('playing',()=>{if(audio.getAttribute('src')&&!audio.paused){clearWatchdog();$('#status').textContent='Playing your supplied stream.';}});
audio.addEventListener('pause',()=>{if(audio.getAttribute('src')&&audio.paused&&(audio.currentTime>0||audio.readyState>=2)){clearWatchdog();$('#status').textContent='Stream paused. Resume with the audio controls.';}});
audio.addEventListener('ended',()=>{clearWatchdog();if(audio.getAttribute('src'))$('#status').textContent='Stream ended.';});
window.addEventListener('pagehide',()=>{lastStream=null;retry.disabled=true;halt();});render();


