# Touch Me Not
### Built by Roshni Biswas, Austin Presley, Damilare and Juhi Park at [HackDavis 2019](https://www.hackdavis.io/)

## Inspiration
This project is inspired by people who are ashamed by their mental health issues and fail to get the help they need. With today's technology where human facial features and expressions can be extracted, detected, and recognized through computer algorithms, examining a person's face can be one method of effectively discerning their genuine mood and reactions, therefore helping a counselor, doctor, or teacher better assess someone's mental states using their facial expressions.

## What Touch-Me-Not does
This web-app assists professionals in the public health sector that deal with people facing mental health issues like doctors, teachers, and counselors. It detects emotional expression from the person and provides information about the person like whether if the person is under stress. This website accepts videos and breaks it down by frames. It then uses google cloud vision API to detect facial expressions of the person and generates a large data set representing a person's mood over time. The data set is then analyzed and visualized in a graph to shows the person's mental states and changes in mood over time.

## How we built it
We first make a website using JavaScript that accepts videos in mp4 and breaks it down by frames, forming an array of images using open cv. The images are then analyzed through the [Vision API from Google Cloud Platform](https://cloud.google.com/vision/) that detects facial expressions of the person and generates a 2D list representing a person's different emotion in scale. Finally, we visualize the data using matplotlib and numpy which is push back to the website.

## Tech-stack
Using Google Cloud Platform, Python, Vision API, HTML, CSS, JavaScript, JQuery and OpenCV.

## Future Implications
We would integrate real-time analysis of a person's emotion without having to upload files.

## How to Run
The API used to record videos requires a secure origin: HTTPS or localhost. We used localhost. You can run `python3 -m http.server` to use get a local host up and running. It would run on localhost:8000 by default. Check [here](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) for more info.
