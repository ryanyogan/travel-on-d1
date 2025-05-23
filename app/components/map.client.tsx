import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export function MapClient({ mapData }: { mapData: any }) {
  const ring = mapData?.coordinates?.[0] ?? [[22.54992, 0]];
  const path = ring.map(([lng, lat]: any) => ({ lat, lng }));

  const centroid = path.reduce(
    (acc: any, p: any) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );

  centroid.lat /= path.length;
  centroid.lng /= path.length;

  return (
    <APIProvider apiKey={"AIzaSyAQqWDniSUNMdCfOn0vkoq2vSBkj2zsXGU"}>
      <Map
        style={{ width: "100%", height: "500px" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        center={centroid}
      >
        {mapData?.coordinates && (
          <Marker position={centroid} label={mapData.name} />
        )}
      </Map>
    </APIProvider>
  );
}
