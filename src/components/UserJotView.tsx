import React from 'react';
import { Modal, View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { UserJot } from '../UserJot';

interface UserJotViewProps {
  visible: boolean;
  url: string | null;
  onClose: () => void;
}

export const UserJotView: React.FC<UserJotViewProps> = ({
  visible,
  url,
  onClose,
}) => {
  if (!url) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          userAgent={UserJot.getUserAgent()}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            Alert.alert(
              'Error',
              `Failed to load UserJot: ${nativeEvent.description}`,
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 17,
    color: '#007AFF',
  },
  webview: {
    flex: 1,
  },
});
