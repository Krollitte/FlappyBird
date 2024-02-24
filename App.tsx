import React, { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import {
  Canvas,
  useImage,
  Image,
  Group,
  Fill,
  interpolate,
  Extrapolate,
  Text,
  matchFont,
} from "@shopify/react-native-skia";
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
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

const GRAVITY = 1000;
const JUMP_FORCE = -500;

interface RNFontStyle {
  fontFamily: string;
  fontSize: number;
  fontStyle: Slant;
  fontWeight: Weight;
}

type Slant = "normal" | "italic" | "oblique";
type Weight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

const App = () => {
  const [score, setScore] = useState(0);
  const { width, height } = useWindowDimensions();
  const backgroundImage = useImage(
    require("./assets/sprites/background-day.png")
  );
  const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
  const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));
  const base = useImage(require("./assets/sprites/base.png"));

  const x = useSharedValue(width);
  const birdY = useSharedValue(height / 3);
  const birdYVelocity = useSharedValue(0);
  const birdTransform = useDerivedValue(() => {
    return [
      {
        rotate: interpolate(
          birdYVelocity.value,
          [-500, 500],
          [-0.5, 0.5],
          Extrapolate.CLAMP
        ),
      },
    ];
  });
  const birdOrigin = useDerivedValue(() => {
    return {
      x: width / 4 + 32,
      y: birdY.value + 24,
    };
  });
  const pipeOffset = 0;
  const gesture = Gesture.Tap().onStart(() => {
    birdYVelocity.value = JUMP_FORCE;
  });

  const birdPos = {
    x: width / 4,
  };
  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
  const fontStyle: RNFontStyle = {
    fontStyle: "normal",
    fontFamily,
    fontSize: 40,
    fontWeight: "700",
  };
  const font = matchFont(fontStyle);

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
  }, []);

  useAnimatedReaction(
    () => x.value,
    (currentValue, previousValue = 0) => {
      const middle = birdPos.x;
      if (
        currentValue !== previousValue &&
        previousValue &&
        currentValue <= middle &&
        previousValue > middle
      ) {
        //console.log("score ++");

        runOnJS(setScore)(score + 1);
      }
    }
  );

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
          <Group
            transform={birdTransform}
            color={"lightblue"}
            origin={birdOrigin}
          >
            <Image
              image={bird}
              y={birdY}
              x={birdPos.x}
              width={64}
              height={48}
            />
          </Group>
          <Text
            x={width / 2 - 30}
            y={100}
            text={score.toLocaleString()}
            font={font}
          />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default App;
