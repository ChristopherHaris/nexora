/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
// import { readFile } from "node:fs/promises";
// import { join } from "node:path";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  //   const interBold = await readFile(
  //     join(process.cwd(), "assets/Inter-Bold.ttf")
  //   );
  //   const interRegular = await readFile(
  //     join(process.cwd(), "assets/Inter-Regular.ttf")
  //   );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#fef3c8",
        fontFamily: "Inter",
      }}
    >
      {/* Left side - Image area with border */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: "bold",
          }}
        >
          <img
            src="https://97swgy9if6.ufs.sh/f/otX6HsU3RJwxIN8BqjupbtQfL2809cWhK6vsxF5oPYglreuU"
            style={{
              width: "90%",
              height: "90%",
              objectFit: "cover",
            }}
            alt="Sema FTD"
          />
        </div>
      </div>

      {/* Right side - Text content */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 50px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#000000",
            lineHeight: 1.2,
            marginBottom: 30,
            letterSpacing: "-2px",
          }}
        >
          Sema FTD
        </div>
      
        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: "#1a1a1a",
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          The Student Senate of the Faculty of Technology and Design at UBM.
        </div>
      </div>
    </div>,
    {
      ...size,
      //   fonts: [
      //     {
      //       name: "Inter",
      //       data: interBold,
      //       style: "normal",
      //       weight: 700,
      //     },
      //     {
      //       name: "Inter",
      //       data: interRegular,
      //       style: "normal",
      //       weight: 400,
      //     },
      //   ],
    }
  );
}
