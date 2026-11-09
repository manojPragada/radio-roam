export const stations=[{id:'tokyo',name:'Tokyo Afterglow',city:'Tokyo',genre:'Imagined late-night jazz',lon:140,lat:36},{id:'lisbon',name:'Lisbon Sol',city:'Lisbon',genre:'Imagined coastal grooves',lon:-9,lat:39},{id:'toronto',name:'Toronto Frequencies',city:'Toronto',genre:'Imagined independent sounds',lon:-79,lat:44},{id:'nairobi',name:'Nairobi Current',city:'Nairobi',genre:'Imagined future rhythms',lon:37,lat:-1}];
export function filterStations(query){const q=query.trim().toLowerCase();return stations.filter(s=>(s.name+' '+s.city+' '+s.genre).toLowerCase().includes(q));}
export function streamURL(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}}
export function browserNetworkHint(online){return online===false?'This browser reports offline. Reconnect before retrying the stream.':'';}
export function streamFormatHint(value){
  const valid=streamURL(value);if(!valid)return 'Enter a credential-free direct HTTPS URL to see a format hint.';
  const extension=new URL(valid).pathname.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  const names={mp3:'MP3',aac:'AAC',m4a:'AAC',ogg:'Ogg',opus:'Opus',wav:'WAV'};
  return names[extension]?`${names[extension]} filename hint · browser support and stream availability are not verified.`:'Format unknown from the URL · browser support and stream availability are not verified.';
}
export function capabilitySummary(check){
  const formats=[['MP3','audio/mpeg'],['AAC','audio/aac'],['Ogg','audio/ogg; codecs="vorbis"'],['Opus','audio/ogg; codecs="opus"'],['WAV','audio/wav']];
  const supported=formats.filter(([,mime])=>['maybe','probably'].includes(check(mime))).map(([name])=>name);
  return supported.length?`This browser reports possible playback for: ${supported.join(', ')}. Remote stream health is not tested.`:'This browser reports no capability for the checked formats. Remote stream health is not tested.';
}
export function attemptLabel(attempt){const value=Number(attempt);return Number.isInteger(value)&&value>0?`Session playback attempt ${value} · not a remote health check`:'No playback attempt this session';}
export function favoritesLabel(favorites){const count=loadFavorites(JSON.stringify(favorites)).length;return `${count} fictional ${count===1?'station':'stations'} saved locally`;}
export function favoritesCatalogLabel(favorites){const count=loadFavorites(JSON.stringify(favorites)).length,percent=Math.round(count/stations.length*100);return `${count}/${stations.length} fictional catalog saved (${percent}%)`;}
export function favoriteActionsEnabled(favorites){return loadFavorites(JSON.stringify(favorites)).length>0;}
export function visibleFavoritesLabel(visible,favorites){const saved=new Set(loadFavorites(JSON.stringify(favorites))),count=visible.filter(station=>saved.has(station.id)).length;return `${count} saved ${count===1?'station':'stations'} in current view`;}
export function visibleUnsavedLabel(visible,favorites){const saved=new Set(loadFavorites(JSON.stringify(favorites))),count=visible.filter(station=>!saved.has(station.id)).length;return `${count} unsaved ${count===1?'station':'stations'} in current view`;}
export function clearFavorites(){return [];}
export function favoriteExport(favorites){const saved=new Set(loadFavorites(JSON.stringify(favorites)));return {version:1,kind:'radio-roam-fictional-favorites',stations:stations.filter(station=>saved.has(station.id)).map(({id,name,city,genre})=>({id,name,city,genre}))};}
export function favoriteExportLabel(favorites){const count=favoriteExport(favorites).stations.length;return `${count} fictional ${count===1?'station':'stations'} exported; no stream URLs included`;}
export function favoriteImport(value){if(!value||value.version!==1||value.kind!=='radio-roam-fictional-favorites'||!Array.isArray(value.stations)||value.stations.length>stations.length)throw new Error('Invalid Radio Roam favorites file');const ids=value.stations.map(item=>item?.id);if(!ids.every(id=>typeof id==='string'&&stations.some(station=>station.id===id)))throw new Error('Favorites file contains an unknown station');return [...new Set(ids)];}
export function mergeFavorites(current,incoming){return loadFavorites(JSON.stringify([...loadFavorites(JSON.stringify(current)),...loadFavorites(JSON.stringify(incoming))]));}
export function favoriteMergeSummary(current,incoming){const before=loadFavorites(JSON.stringify(current)),validated=loadFavorites(JSON.stringify(incoming)),merged=mergeFavorites(before,validated),added=merged.length-before.length;return {merged,added,alreadySaved:validated.length-added,total:merged.length};}
export function loadFavorites(raw){try{const value=JSON.parse(raw);return Array.isArray(value)?[...new Set(value.filter(id=>stations.some(s=>s.id===id)))]:[];}catch{return [];}}
export function loadLastStation(raw){return stations.find(station=>station.id===raw)??stations[0];}
export function stationIndexForKey(index,length,key) {
  if(!Number.isInteger(index)||length<1)return -1;
  if(key==='Home')return 0;if(key==='End')return length-1;
  if(key==='ArrowDown'||key==='ArrowRight')return (index+1)%length;
  if(key==='ArrowUp'||key==='ArrowLeft')return (index-1+length)%length;
  return index;
}


export function chooseStation(visible, id) { return visible.find(station=>station.id===id)??visible[0]??null; }
export function toggleFavorite(favorites, id) {
  const valid=loadFavorites(JSON.stringify(favorites));
  if(!stations.some(station=>station.id===id))return valid;
  return valid.includes(id)?valid.filter(value=>value!==id):[...valid,id];
}
export function mediaErrorMessage(code) {
  return ({1:'Playback was interrupted.',2:'Network error while loading the stream.',3:'The stream could not be decoded.',4:'Unsupported audio format or unavailable stream.'})[code]??'Unable to play this stream.';
}
export function streamRecoveryMessage(code,{retryAvailable=false,online=true}={}){
  const base=mediaErrorMessage(code);
  if(online===false)return `${base} This browser reports offline; reconnect before retrying.`;
  return `${base} ${retryAvailable?'Retry the last stream or choose':'Choose'} another direct HTTPS URL.`;
}
export function failureStreakLabel(count){const value=Number(count);if(!Number.isInteger(value)||value<1)return 'No consecutive playback failures this session';if(value===1)return '1 consecutive playback failure this session · retry remains user initiated';return `${value} consecutive playback failures this session · consider another direct HTTPS URL before retrying · no automatic retry`;}


