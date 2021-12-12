import {useState} from 'react';
import {useDrop} from 'react-dnd';
//style
import classes from "styles/index.module.scss"
//types
import {dragItemType, DropZonePropsTypes} from "../types/componentType";
import {QUESTION_TYPE} from "@components/constants";
//translations
import {translations as englishTranslations} from "../translations/english";
import {translations as persianTranslations} from "../translations/persian";




const DropZone = ({addQuestionFunction, children,acceptType}:DropZonePropsTypes):JSX.Element => {

    const [language, setLanguage] = useState('persian')
    const translations = (language === 'english' ? englishTranslations : persianTranslations)
    const [{isOver}, drop] = useDrop(() => ({
        accept: acceptType,
        drop(item:dragItemType, monitor) {
            if(acceptType === QUESTION_TYPE) {

                addQuestionFunction(item.question.questionType)
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }), );

    return (<div ref={drop} className={classes.form_container}>
        <div>
            {children}
            <div className={classes.place_holder}>{translations.placeHolder[acceptType].titleText}</div>
        </div>
    </div>);
};
export default DropZone;