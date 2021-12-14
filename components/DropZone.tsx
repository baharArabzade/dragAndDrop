import {useState} from 'react';
import {useDrop} from 'react-dnd';
import uuid from "uuid/v4";
//style
import classes from "styles/index.module.scss"
//types
import {dragItemType, DropZonePropsTypes} from "types/componentType";
//translations
import {translations as englishTranslations} from "translations/english";
import {translations as persianTranslations} from "translations/persian";

const DropZone = ({
                      addQuestionFunction,
                      addAppreciationPage,
                      addWelcomePage,
                      addSubQuestionToGroupQuestion,
                      children,
                      acceptType,
                      type,
                      className,
                      groupQuestionId,
                  }: DropZonePropsTypes): JSX.Element => {

    const [language, setLanguage] = useState('persian')
    const translations = (language === 'english' ? englishTranslations : persianTranslations)
    const [{isOverCurrent}, drop] = useDrop(() => ({
        accept: acceptType,
        drop(item: dragItemType, monitor) {
            const dropOnChild = monitor.didDrop();
            if (dropOnChild) {
                return;
            }
            switch (type) {
                case 'groupQuestion':
                    if (item.question.questionType != 'group') {
                        addSubQuestionToGroupQuestion(item.question, groupQuestionId)
                    }
                    return;
                case 'welcomePage':
                    addWelcomePage(uuid())
                    return;
                case 'appreciationPage':
                    addAppreciationPage(uuid())
                    return;
                default:
                    addQuestionFunction(item.question.questionType)
                    return;
            }
        },
        collect: (monitor) => ({
            isOverCurrent: monitor.isOver({shallow: true}),
        }),
    }),);

    return (<div ref={drop}>
        <div className={classes[className]}>
            {children}
            <div
                className={isOverCurrent ? classes.place_holder_isOver : classes.place_holder}>{translations.placeHolder[type].titleText}
            </div>
        </div>
    </div>);
};
export default DropZone;