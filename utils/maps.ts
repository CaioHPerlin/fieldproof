import { Linking } from "react-native";

export function openMaps(latitude: number, longitude: number): void {
  Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`);
}
