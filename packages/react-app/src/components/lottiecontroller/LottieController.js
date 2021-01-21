import React from 'react';
import Lottie from 'react-lottie-player';
// import * as animationData from "./lf30_editor_Zj0PnM.json";
import shieldAuth from "./jsons/shieldAuth.json";



const listOfAnimations = [{animation: shieldAuth, speed: 1, loop: false}];


export function LottieController({selectedAnimation}) {

    return <Lottie loop={listOfAnimations[selectedAnimation].loop}
                   speed={listOfAnimations[selectedAnimation].speed}
                   play={true}
                   animationData={listOfAnimations[selectedAnimation].animation}
    />;

}
