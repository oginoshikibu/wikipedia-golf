import React, { useState } from "react";
import { Steps } from "intro.js-react";

export default function Tutorial({exitFunc}) {

    const [stepsEnabled, setStepsEnabled] = useState(true);
    const titleCSSSelector = "#app > div.flex.w-full.h-16.bg-white.border-b-2.z-50 > div.flex-1.flex.justify-center.items-center.text-3xl.font-bold"
    const currentAndGoalInfoCSSSelector = "#app > div.fixed.bottom-0.flex.w-full.bg-white.border-t-2.border.z-50 > div.m-auto.justify-center"
    const scoreCSSSelector = "#app > div.fixed.bottom-0.flex.w-full.bg-white.border-t-2.border.z-50 > div.my-2.mr-6.ml-2.justify-center > div.center"
    const remainTimeCSSSelector = "#app > div.fixed.bottom-0.flex.w-full.bg-white.border-t-2.border.z-50 > div.my-2.mr-6.ml-2.justify-center > div:nth-child(2)"
    const moveBackButtonCSSSelector = "#app > div.fixed.bottom-0.flex.w-full.bg-white.border-t-2.border.z-50 > div.my-auto.py-1.ml-3.justify-center > button"
    const hintButtonCSSSelector = "#app > div.fixed.bottom-0.flex.w-full.bg-white.border-t-2.border.z-50 > div.my-auto.py-1.mr-3 > button"

    const steps = [
        {
            element: titleCSSSelector,
            intro: "Wikipedia Golfへようこそ！  このゲームは目的のwikipediaのページまで、リンクをクリックしてたどり着くゲームです。",
        },
        {
            element: currentAndGoalInfoCSSSelector,
            intro: "ここには現在のページとゴールとなる目的のページが表示されます。",
        },
        {
            element: scoreCSSSelector,
            intro: "ここには打数（リンクをクリックした回数）が表示されます。出来るだけ少ない打数でゴールを目指しましょう！！！",

        },
        {
            element: remainTimeCSSSelector,
            intro: "ここには残り時間が表示されます。",
        },
        {
            element: moveBackButtonCSSSelector,
            intro: "ここには戻るボタンがあります。間違えた場合には、こちらを利用して戻ることができますが、打数を1打消費するので慎重に進めましょう。",
        },
        {
            element: hintButtonCSSSelector,
            intro: "ここをクリックすると、ゴールページを閲覧することが出来ます。"
        }

    ];


    const onExit = () => {
        setStepsEnabled(false);
        exitFunc();
    }



    return (
        <>
            <Steps
                enabled={stepsEnabled}
                steps={steps}
                initialStep={0}
                onExit={onExit}
                onBeforeExit={(stepIndex) => stepIndex === steps.length - 1}
                options={
                    {
                        skipLabel: "",
                        doneLabel: "Let's start!",
                        scrollToElement: false,
                    }
                }
            />
        </>
    );
}