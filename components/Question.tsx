import React, {useState} from 'react';
//style
import classes from "styles/components/question.module.scss";
// types
import {RenderQuestionPropsTypes} from "types/componentType";
//translations
import {translations as persianTranslations} from "translations/persian";
import {translations as englishTranslations} from "translations/english";

const RenderQuestion = ({question}: RenderQuestionPropsTypes): JSX.Element => {
    const [language, setLanguage] = useState<string>('persian')
    const translations = (language === 'english' ? englishTranslations : persianTranslations)
    return (
        <div
            className={`${classes.question_row}`}
        >
            {translations.questions[question.questionType].titleText}
        </div>


    );
};

export default RenderQuestion;