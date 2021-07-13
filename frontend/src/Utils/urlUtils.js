export function roomUrlFromPageUrl() {
  //determining the room url to be joined from the url in the address bar if user directly joins pasting the link in address bar
  const match = window.location.search.match(/roomUrl=([^&]+)/i);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export function pageUrlFromRoomUrl(roomUrl) {
  //creating url to be set in address bar on room joining
  return (
    window.location.href.split("?")[0] +
    (roomUrl ? `?roomUrl=${encodeURIComponent(roomUrl)}` : "")
  );
}
