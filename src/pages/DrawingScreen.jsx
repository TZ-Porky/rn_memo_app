import {StyleSheet, View, Alert} from 'react-native';
import React, {useRef, useState, useEffect, useCallback} from 'react';

import HeaderDrawingBar from '../components/HeaderDrawingBar';

import Signature from 'react-native-signature-canvas';
import ToolBoxDrawing from '../components/ToolBoxDrawing';

const DrawingScreen = () => {
  const signatureRef = useRef();
  const webviewRef = useRef(null);
  const [color, setColor] = useState('black');
  const [size, setSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleSave = () => {
    signatureRef.current?.readSignature();
    Alert.alert('Dessin enregistré !');
  };

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

  const handleToolChange = useCallback(() => {
    if (!isWebViewReady || !webviewRef.current) {return;}

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

  useEffect(() => {
    if (isWebViewReady) {
      handleToolChange();
    }
  }, [handleToolChange, isWebViewReady]);

  // Applique les changements immédiatement
  useEffect(() => {
    handleToolChange();
  }, [handleToolChange]);

  const handleWebViewLoad = () => {
    setIsWebViewReady(true);
    handleToolChange();
  };


  return (
    <View style={styles.container}>
      <HeaderDrawingBar
        onCancelPress={handleClear}
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
        signatureRef={signatureRef}
        injectJS={injectDrawingSettings}
        onToolChange={handleToolChange}
      />
      <View style={styles.signatureContainer}>
      <Signature
          key={`${color}-${size}-${isEraser}`}
          ref={signatureRef}
          onOK={sig => console.log('Dessin enregistré', sig)}
          onEmpty={() => console.log('Canevas vide')}
          descriptionText="Dessinez ci-dessous"
          webStyle={`
            .m-signature-pad--footer { display: none; }
            body, html { background-color: white; height: 100%; margin: 0; overflow: hidden; }
            canvas {
              touch-action: none;
              stroke: ${isEraser ? 'white' : color};
              stroke-width: ${size};
            }
          `}
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
