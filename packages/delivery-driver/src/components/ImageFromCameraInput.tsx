import { Box, Button, Image, Stack, UnstyledButton } from "hyfn-client";
import React, { useEffect, useRef, useState } from "react";

interface ImageFromCameraInputProps {}

const ImageFromCameraInput: React.FC<ImageFromCameraInputProps> = ({}) => {
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageUrl] = useState("");
  const [closeCamera, setCloseCamera] = useState(false);
  const [stream, setStream] = useState<any>();
  const video = useRef(null);
  const canvas = useRef(null);

  const width = 320; // We will scale the photo width to this
  let height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  let streaming = false;

  useEffect(() => {
    // startup()

    // video = document.getElementById('video')
    // canvas = document.getElementById('canvas')
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");
    let streamToStop = null;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.current.srcObject = stream;
        // setStream(stream)
        streamToStop = stream;
        video.current.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    // video.current.addEventListener(
    //   'canplay',
    //   (ev) => {
    //     if (!streaming) {
    //       height = video.current.videoHeight / (video.current.videoWidth / width)

    //       // Firefox currently has a bug where the height can't be read from
    //       // the video, so we will make assumptions if this happens.

    //       if (isNaN(height)) {
    //         height = width / (4 / 3)
    //       }

    //       video.current.setAttribute('width', width)
    //       video.current.setAttribute('height', height)
    //       canvas.current.setAttribute('width', width)
    //       canvas.current.setAttribute('height', height)
    //       streaming = true
    //     }
    //   },
    //   false,
    // )

    startbutton.addEventListener(
      "click",
      (ev) => {
        takepicture();
        ev.preventDefault();
      },
      false
    );

    clearphoto();

    return () => {
      // console.log(streamToStop)

      streamToStop.getTracks().forEach(function (track) {
        track.stop();
      });
    };
  }, []);
  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  // let video = null
  // let canvas = null
  let photo = null;
  let startbutton = null;

  function showViewLiveResultButton() {
    if (window.self !== window.top) {
      // Ensure that if our document is in a frame, we get the user
      // to first open it in its own tab or window. Otherwise, it
      // won't be able to request permission for camera access.
      document.querySelector(".contentarea").remove();
      const button = document.createElement("button");
      button.textContent = "View live result of the example code above";
      document.body.append(button);
      button.addEventListener("click", () => window.open(location.href));
      return true;
    }
    return false;
  }

  function startup() {
    if (showViewLiveResultButton()) {
      return;
    }
    // video = document.getElementById('video')
    // canvas = document.getElementById('canvas')
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.current.srcObject = stream;
        setStream(stream);
        video.current.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    // video.current.addEventListener(
    //   'canplay',
    //   (ev) => {
    //     if (!streaming) {
    //       height = video.current.videoHeight / (video.current.videoWidth / width)

    //       // Firefox currently has a bug where the height can't be read from
    //       // the video, so we will make assumptions if this happens.

    //       if (isNaN(height)) {
    //         height = width / (4 / 3)
    //       }

    //       video.current.setAttribute('width', width)
    //       video.current.setAttribute('height', height)
    //       canvas.current.setAttribute('width', width)
    //       canvas.current.setAttribute('height', height)
    //       streaming = true
    //     }
    //   },
    //   false,
    // )

    startbutton.addEventListener(
      "click",
      (ev) => {
        takepicture();
        ev.preventDefault();
      },
      false
    );

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    // const context = canvas.current.getContext('2d')
    // context.fillStyle = '#AAA'
    // context.fillRect(0, 0, canvas.current.width, canvas.current.height)

    // const data = canvas.current.toDataURL('image/png')
    // photo.setAttribute('src', data)
    setImage(null);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    const context = canvas.current.getContext("2d");
    if (width && height) {
      try {
        canvas.current.width = width;
        canvas.current.height = height;
        context.drawImage(video.current, 0, 0, width, height);
        // console.log('🚀 ~ file: ImageFromCameraInput.tsx:183 ~ takepicture ~ context', context)
        console.log(
          "🚀 ~ file: ImageFromCameraInput.tsx:193 ~ takepicture ~ data"
        );
        canvas.current.toBlob((blob) => {
          const file = new File([blob], "newImage.png");
          setImage(file);
        });
        const data = canvas.current.toDataURL("image/png");

        setImageUrl(data);
        // photo.setAttribute('src', data)
      } catch (error) {
        console.log(
          "🚀 ~ file: ImageFromCameraInput.tsx:199 ~ takepicture ~ error",
          error
        );
      }
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  // window.addEventListener('load', startup, false)

  return (
    <Stack>
      {/* {!image ? ( */}
      <Stack
        sx={{
          display: image ? "none" : "",
        }}
      >
        <video
          onCanPlay={(ev) => {
            if (!streaming) {
              height =
                video.current.videoHeight / (video.current.videoWidth / width);

              // Firefox currently has a bug where the height can't be read from
              // the video, so we will make assumptions if this happens.

              if (isNaN(height)) {
                height = width / (4 / 3);
              }

              video.current.setAttribute("width", width);
              video.current.setAttribute("height", height);
              canvas.current.setAttribute("width", width);
              canvas.current.setAttribute("height", height);
              streaming = true;
            }
          }}
          ref={video}
        >
          Video stream not available.
        </video>
        <button
          onClick={() => {
            takepicture();
          }}
          id="startbutton"
        >
          Take photo
        </button>
      </Stack>
      {/* ) : ( */}
      <Stack
        sx={{
          display: !image ? "none" : "",
        }}
      >
        <Image
          width={width}
          height={300}
          src={imageURL}
          id="photo"
          alt="The screen capture will appear in this box."
        />
        <Button onClick={() => clearphoto()}>clear</Button>
      </Stack>
      {/* )} */}
      <canvas
        style={{
          display: "none",
        }}
        ref={canvas}
      >
        {" "}
      </canvas>
    </Stack>
  );
};

export default ImageFromCameraInput;
