import React, {useEffect, useState} from 'react';
import uuid from 'uuid/v4';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import SampleQuestionsColumn, {sampleQuestions} from "components/mainRightColumn/SampleQuestionsColumn"
import QuestionRow from "components/mainLeftColumn/QuestionRow";
//style
import styles from "styles/index.module.scss"
//types
import {droppableItemInfoType, listOfItemsType} from "types/componentType";

const BuildPage = (): JSX.Element => {

    const [data, setData] = useState<object>({'welcome': [], 'exam': [], 'appreciation': []})
    const [draggedItemType, setDraggedItemType] = useState<string>('')
    const [hasAppreciation, setHasAppreciation] = useState<boolean>(false)
    const [hasWelcome, setHasWelcome] = useState<boolean>(false)

    const reorder = (list:listOfItemsType, startIndex: number, endIndex: number): listOfItemsType=> {
        const result = list;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const copy = (source:listOfItemsType, destination: listOfItemsType, droppableSource:droppableItemInfoType, droppableDestination: droppableItemInfoType): listOfItemsType => {
        const destClone = Array.from(destination);
        const item = source[droppableSource.index];
        destClone.splice(droppableDestination.index, 0, {...item, id: uuid()});

        switch (item.type) {
            case 'welcome':
                setHasWelcome(true)
                break;
            case 'appreciation':
                setHasAppreciation(true)

        }
        return destClone;

    };

    const move = (source:listOfItemsType, destination: listOfItemsType, droppableSource: droppableItemInfoType, droppableDestination: droppableItemInfoType) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);

        destClone.splice(droppableDestination.index, 0, removed);

        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;

        return result;
    };
    const findItemType = (droppableId:string, index:number):string => {
        switch (droppableId) {
            case 'questionsBox':
                return sampleQuestions[index].type
            default:
                return data[droppableId][index].type
        }

    }
    const onDragStart = (result:any) => {
        const {droppableId, index} = result.source
        setDraggedItemType(findItemType(droppableId, index))


    }
    const onDragEnd = (result:any) => {
        const {source, destination} = result;
        if (!destination) {
            return;
        }
        let newData = data
        switch (source.droppableId) {
            case destination.droppableId:
                newData[destination.droppableId] = reorder(
                    data[source.droppableId],
                    source.index,
                    destination.index
                )
                break;

            case 'questionsBox':
                newData[destination.droppableId] = copy(
                    sampleQuestions,
                    data[destination.droppableId],
                    source,
                    destination
                )
                setData(newData)
                break;

            default:
                let changedData = move(
                    data[source.droppableId],
                    data[destination.droppableId],
                    source,
                    destination
                )
                newData[source.droppableId] = changedData[source.droppableId]
                newData[destination.droppableId] = changedData[destination.droppableId]
                setData(newData)
                break;
        }
    };
    return (

        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <SampleQuestionsColumn isAppreciationDragDisable={hasAppreciation} isWelcomeDragDisable={hasWelcome}/>
            <div style={{marginRight: '400px', padding: '10px'}}>
                {Object.keys(data).map((list) => {
                    return (
                        <Droppable key={list} droppableId={list} isDropDisabled={draggedItemType !== list}>
                            {(provided) => (
                                <div className={styles.list}
                                     ref={provided.innerRef}
                                >

                                    {data[list].length ?
                                        data[list].map(
                                            (item, index) => (
                                                <QuestionRow item={item} index={index}
                                                             isDragDisabled={(list === 'welcome' && hasWelcome) || (list === 'appreciation' && hasAppreciation)}/>
                                            )
                                        ) : <></>}
                                    {!((list === 'welcome' && hasWelcome) || (list === 'appreciation' && hasAppreciation)) &&
                                    <div className={styles.place_holder}>
                                        Drop items here
                                    </div>}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    );
                })}
            </div>
        </DragDropContext>

    );

}


export default BuildPage