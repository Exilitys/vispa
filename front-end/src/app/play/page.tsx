"use client";

import React, { useEffect, useRef, useState } from "react";
import { Strings } from "@/constants/Strings";
import FloatingNavbar from "@/components/ui/floating-navbar";
import Navbar from "@/components/ui/navbar";
import { IconCameraOff } from "@tabler/icons-react";
import FooterSection from "@/components/home/FooterSection";

// Main Camera Component
const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [handPresence, setHandPresence] = useState<boolean | null>(null);
  const [HandPrediction, setHandPrediction] = useState<string>("No Character");

  // const [displayList, setDisplayList] = useState<string[]>([]);
  const [indexList, setIndexList] = useState<number>(0);
  const [prevIndexList, setPrevIndexList] = useState<number>(-1);
  const previousValueRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const exampleString = Strings;
  const [availableIndices, setAvailableIndices] = useState<number[]>([]);
  const [targetString, setTargetString] = useState<string[]>([]);
  // const [targetStringIndex, setTargetStringIndex] = useState<number>(0);
  // const [Points, setPoints] = useState<number>(0);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to pick a random index that hasn't been used yet
  const pickRandomIndex = () => {
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    return availableIndices.splice(randomIndex, 1)[0]; // Remove the picked index from the available indices
  };

  // Set initial random string on mount
  useEffect(() => {
    const initialIndices = Array.from(
      { length: exampleString.length },
      (_, i) => i
    );
    setAvailableIndices(initialIndices); // Create a list of available indices
  }, []);

  useEffect(() => {
    if (availableIndices.length > 0) {
      const randomIndex = pickRandomIndex();
      setTargetString(exampleString[randomIndex]);
      // setTargetStringIndex(randomIndex);
    } else {
      console.log("No more strings available.");
      // Optional: Reset or finish the game
    }
  }, [availableIndices]);

  useEffect(() => {
    if (indexList >= targetString.length) {
      if (availableIndices.length > 0) {
        const randomIndex = pickRandomIndex();
        setTargetString(exampleString[randomIndex]);
        // setTargetStringIndex(randomIndex);
        setIndexList(0);
        setPrevIndexList(-1);
        // setPoints((p) => p + 100);
        // setDisplayList([]);
      } else {
        console.log("No more strings available.");
        // Optional: Reset, reshuffle, or end
      }
    }
  }, [indexList, availableIndices]);

  useEffect(() => {
    if (previousValueRef.current !== HandPrediction) {
      previousValueRef.current = HandPrediction;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        if (
          HandPrediction !== "No Character" &&
          HandPrediction === targetString[indexList]
        ) {
          // setDisplayList((l) => [...l, HandPrediction]);
          setPrevIndexList(prevIndexList === -1 ? 0 : indexList);
          setIndexList((i) => i + 1);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [HandPrediction]);

  useEffect(() => {
    const sendFrameToFlask = async () => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const formData = new FormData();
          formData.append("file", blob, "frame.jpg");

          try {
            const response = await fetch("http://127.0.0.1:5000/detect", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              // setHandPresence(data.hands_detected);
              setHandPrediction(data.predicted_character);
            } else {
              console.error("Response failed:", response.statusText);
            }
          } catch (error) {
            console.error("Fetch failed", error);
          }
        }, "image/jpeg");
      }
    };

    if (isCameraOn) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadeddata = () => {
              if (canvasRef.current && videoRef.current) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
              }
            };
          }

          intervalRef.current = setInterval(sendFrameToFlask, 500);
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      };

      startCamera();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    console.log("Camera toggled");
    setIsCameraOn((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <Navbar />
      <FloatingNavbar />
      <div className="mt-12 flex flex-col justify-center items-center">
        <h3 className="text-xl text-black dark:text-white text-center md:text-left max-w-3/4">
          Sign The Word
        </h3>
        <div className="my-5 text-xl font-bold">
          {targetString.map((char, index) => (
            <span
              key={index}
              className={`${
                index <= prevIndexList ? "text-red-500" : "text-black"
              } px-2 text-4xl`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center w-sm md:w-2xl mx-auto">
        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg items-center "
          />
        ) : (
          <div className="w-full h-52 md:h-96 bg-gray-100 rounded-lg shadow-lg flex justify-center items-center">
            <IconCameraOff size={100} className="w-full items-center" />
          </div>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={toggleCamera}
          className={` text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer ${
            isCameraOn ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        </button>
      </div>

      <div className="flex items-center justify-center">
        <h2 className="text-3xl font-bold text-black dark:text-white py-5 text-center md:text-left max-w-3/4">
          {HandPrediction}
        </h2>
      </div>
      <FooterSection />
    </div>
  );
};

export default Camera;
