import {StyleSheet, View} from 'react-native';
import React, {useRef, useState, useEffect, useCallback} from 'react';

import HeaderDrawingBar from '../components/HeaderDrawingBar';

import Signature from 'react-native-signature-canvas';
import ToolBoxDrawing from '../components/ToolBoxDrawing';

const DrawingScreen = ({navigation, route}) => {

  // State to manage the key for the signature component
  // This state is used to force a re-render of the signature component
  const [key, setKey] = useState(0);

  // This ref is used to access the signature component
  // It allows us to clear the signature and read the signature data
  const signatureRef = useRef();

  // This ref is used to access the webview component
  // It allows us to inject JavaScript into the webview
  const webviewRef = useRef(null);

  // State to manage the color of the drawing tool
  // This state is used to set the color of the drawing tool
  const [color, setColor] = useState('black');

  // State to manage the size of the drawing tool
  // This state is used to set the size of the drawing tool
  const [size, setSize] = useState(2);

  // State to manage the eraser tool
  // This state is used to toggle between the eraser and the pen
  const [isEraser, setIsEraser] = useState(false);

  // State to manage the initial drawing
  // This state is used to store the initial drawing data
  const [initialDrawing, setInitialDrawing] = useState(null);

  // State to manage the webview readiness
  // This state is used to check if the webview is ready
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  // Handle the clear action
  // This function is called when the user presses the clear button
  function handleClear() {
    signatureRef.current?.clearSignature();
  }

  // Handle the back action
  // This function is called when the user presses the back button
  const handleCancel = () => {
    navigation.goBack();
  };

  // Handle the save action
  // This function is called when the user presses the save button
  const handleSave = () => {
    if (route.params?.noteId) {
      signatureRef.current?.readSignature();
    } else {
      signatureRef.current?.readSignature();
    }
  };

  // This function is injected into the webview
  // It sets the drawing settings for the canvas
  const injectDrawingSettings = useCallback(() => {
    const strokeColor = isEraser ? 'white' : color;
    return `
      (function() {
        var canvas = document.querySelector("canvas");
        if (canvas) {
          var ctx = canvas.getContext("2d");
          ctx.lineWidth = ${size};
          ctx.strokeStyle = "${strokeColor}";
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          true; // Important pour le retour
        }
      })();
    `;
  }, [isEraser, color, size]);

  // This function handles the tool change
  // It injects the drawing settings into the webview
  const handleToolChange = useCallback(() => {
    if (!isWebViewReady || !webviewRef.current) {
      return;
    }

    const tryInjection = () => {
      try {
        const js = injectDrawingSettings();
        webviewRef.current.injectJavaScript(js);
      } catch (e) {
        console.warn('Injection failed, retrying...', e);
        setTimeout(tryInjection, 100);
      }
    };

    tryInjection();
  }, [injectDrawingSettings, isWebViewReady]);

  // This function is called when the webview is ready
  // It sets the webview readiness state to true
  useEffect(() => {
    if (isWebViewReady) {
      handleToolChange();
    }
  }, [handleToolChange, isWebViewReady]);

  // This function set the tool change handler
  useEffect(() => {
    handleToolChange();
  }, [handleToolChange]);

  // This function is called when the component mounts
  // It sets the initial drawing data if it exists
  useEffect(() => {
    if (route.params?.editDrawing) {
      setInitialDrawing(route.params.editDrawing);
    }
  }, [route.params?.editDrawing]);

  // This function is called when the component mounts
  // It sets the key to force a re-render of the signature component
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [color, size, isEraser]);

  return (
    <View style={styles.container}>
      <HeaderDrawingBar
        onCancelPress={handleCancel}
        onRestartPress={handleClear}
        onSavePress={handleSave}
      />
      <ToolBoxDrawing
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        size={size}
        setSize={setSize}
        color={color}
        setColor={setColor}
      />
      <View style={styles.signatureContainer}>
        <Signature
          key={`${key}-${color}-${size}-${isEraser}`}
          ref={signatureRef}
          onOK={sig => {
            console.log(
              '[DrawingScreen] Signature capturée :',
              sig.slice(0, 100),
            );
            navigation.navigate('NotePage', {
              drawingData: sig,
              previousNote: route.params?.previousNote || null,
            });
          }}
          onEmpty={() => console.log('Canevas vide')}
          descriptionText="Dessinez ci-dessous"
          dataURL={initialDrawing}
          webStyle={`
            .m-signature-pad--footer { display: none; }
            body, html { 
              background-color: ${initialDrawing ? 'transparent' : 'white'};
              height: 100%; 
              margin: 0; 
              overflow: hidden; 
            }
            canvas {
              background-color: ${initialDrawing ? 'transparent' : 'white'};
              background-image: ${initialDrawing ? `url(${initialDrawing})` : 'none'};
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              touch-action: none;
              stroke: ${isEraser ? 'white' : color};
              stroke-width: ${size};
            }
          `}
          penColor={isEraser ? 'white' : color}
          dotSize={size}
        />
      </View>
    </View>
  );
};

export default DrawingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  signatureContainer: {
    height: '100%',
    backgroundColor: '#111',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopColor: '#e0e0e0',
  },
});
