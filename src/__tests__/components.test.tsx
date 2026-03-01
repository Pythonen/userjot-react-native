import React from 'react';
import { create, act } from 'react-test-renderer';
import { UserJotView } from '../components/UserJotView';

// Mock react-native
jest.mock('react-native', () => {
  const React = require('react');
  const mock = (name: string) =>
    React.forwardRef((props: any, ref: any) => {
      return React.createElement(name, { ...props, ref }, props.children);
    });
  return {
    Modal: mock('Modal'),
    View: mock('View'),
    Text: mock('Text'),
    TouchableOpacity: mock('TouchableOpacity'),
    Alert: { alert: jest.fn() },
    StyleSheet: { create: (s: any) => s },
    Platform: { OS: 'ios', Version: '17.0' },
  };
});

// Mock react-native-webview
jest.mock('react-native-webview', () => {
  const React = require('react');
  return {
    WebView: (props: any) => React.createElement('WebView', props),
  };
});

// Mock UserJot.getUserAgent
jest.mock('../UserJot', () => ({
  UserJot: {
    getUserAgent: () => 'UserJotSDK/1.0 (ReactNative; iOS 17.0)',
  },
}));

describe('UserJotView', () => {
  const onClose = jest.fn();

  it('returns null when url is null', () => {
    let tree: any;
    act(() => {
      tree = create(
        <UserJotView visible={true} url={null} onClose={onClose} />,
      );
    });
    expect(tree.toJSON()).toBeNull();
  });

  it('renders Modal and WebView when visible with valid URL', () => {
    let tree: any;
    act(() => {
      tree = create(
        <UserJotView
          visible={true}
          url="https://test.userjot.com/roadmap"
          onClose={onClose}
        />,
      );
    });
    const json = tree.toJSON();
    expect(json).not.toBeNull();
    // Root should be a Modal
    expect(json.type).toBe('Modal');
    // Find WebView in the tree
    const flatChildren = (node: any): any[] => {
      if (!node || !node.children) return [];
      return node.children.flatMap((c: any) =>
        typeof c === 'string' ? [] : [c, ...flatChildren(c)],
      );
    };
    const allNodes = flatChildren(json);
    expect(allNodes.some((n: any) => n.type === 'WebView')).toBe(true);
    // Close button text should be present
    expect(allNodes.some((n: any) => n.children?.includes('Close'))).toBe(true);
  });
});
