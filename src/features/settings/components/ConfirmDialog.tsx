import { Alert } from "react-native";

export function confirm(title: string, message: string, confirmText = "Confirm", cancelText = "Cancel"): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelText, style: "cancel", onPress: () => resolve(false) },
      { text: confirmText, style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}

export function info(title: string, message: string, okText = "OK"): Promise<void> {
  return new Promise((resolve) => {
    Alert.alert(title, message, [{ text: okText, onPress: () => resolve() }]);
  });
}
