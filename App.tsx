import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Canvas, useImage, Image } from "@shopify/react-native-skia";
import {
  Easing,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";

const GRAVITY = 500;

const App = () => {
  const { width, height } = useWindowDimensions();
  const backgroundImage = useImage(
    require("./assets/sprites/background-day.png")
  );
  const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
  const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));
  const base = useImage(require("./assets/sprites/base.png"));

  const x = useSharedValue(width);
  const birdY = useSharedValue(0);
  const birdYVelocity = useSharedValue(100);
  const pipeOffset = 0;
  const gesture = Gesture.Tap().onStart(() => {
    console.log("Tap");
    birdYVelocity.value = -300;
  });

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt) {
      return;
    }
    birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
    birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
  });

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(-150, { duration: 3000, easing: Easing.linear }),
        withTiming(width, { duration: 0 }),
        withTiming(-150, { duration: 3000, easing: Easing.linear })
      ),
      -1
    );

    //birdY.value = withTiming(height, { duration: 1000 });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height }}>
          <Image
            image={backgroundImage}
            fit={"cover"}
            width={width}
            height={height}
          />

          <Image
            image={pipeTop}
            fit={"cover"}
            y={pipeOffset - 320}
            x={x}
            width={103}
            height={640}
          />
          <Image
            image={pipeBottom}
            fit={"cover"}
            y={height - 320 + pipeOffset}
            x={x}
            width={103}
            height={640}
          />
          <Image
            image={base}
            fit={"cover"}
            y={height - 75}
            x={0}
            width={width}
            height={150}
          />
          <Image image={bird} y={birdY} x={width / 4} width={64} height={48} />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default App;
