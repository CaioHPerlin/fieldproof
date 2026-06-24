import * as Location from "expo-location";

export type GeoLocation = {
  address: string | null;
  latitude: number;
  longitude: number;
};

export async function suggestCurrentAddress(): Promise<GeoLocation | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;

  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const geocode = await Location.reverseGeocodeAsync({
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  if (geocode.length <= 0) return null;

  return {
    address: geocode[0].formattedAddress,
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
}
