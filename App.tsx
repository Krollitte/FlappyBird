import React from "react";
import { useWindowDimensions } from "react-native";
import { Canvas, useImage, Image } from "@shopify/react-native-skia";

const App = () => {
  const { width, height } = useWindowDimensions();
  const backgroundImage = useImage(
    require("./assets/sprites/background-day.png")
  );
  const bird = useImage(require("./assets/sprites/yellowbird-upflap.png"));
  const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
  const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));
  const base = useImage(require("./assets/sprites/base.png"));

  const pipeOffset = -100;
  return (
    <Canvas style={{ width, height }}>
      <Image
        image={backgroundImage}
        fit={"cover"}
        width={width}
        height={height}
      />

      <Image
        image={pipeBottom}
        fit={"cover"}
        y={height - 320 + pipeOffset}
        x={width / 2}
        width={103}
        height={640}
      />
      <Image
        image={pipeTop}
        fit={"cover"}
        y={pipeOffset - 320}
        x={width / 2}
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
      <Image image={bird} y={height / 2} x={width / 4} width={64} height={48} />
    </Canvas>
  );
};

export default App;
