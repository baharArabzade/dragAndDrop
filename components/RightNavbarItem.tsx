import React, {useState} from "react";
import { useDrag } from "react-dnd";
//style
import  classes from "styles/components/rightNavbar.module.scss"
//types
import {RightNavbarPropsTypes} from "../types/componentType";
//translations
import {translations as englishTranslations} from "../translations/english";
import {translations as persianTranslations} from "../translations/persian";

const RightNavbarItem = ({data,type}:RightNavbarPropsTypes):JSX.Element => {
  const [language, setLanguage] = useState('persian')
  const translations = (language === 'english' ? englishTranslations : persianTranslations)

  const [{ opacity }, drag] = useDrag({
    type:type,
    item: data,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.6 : 1
    })
  });
  return (
    <div className={classes.default_question} ref={drag} style={{ opacity }} key={data.id}>

      {data.question?.questionType?translations.questions[data.question.questionType].titleText:translations[data.type].titleText}
    </div>
  );
};
export default RightNavbarItem;
