import React, {useEffect, useState} from 'react';
import styles from "./createTrainPage.module.css";
import UploadVideoCard from "./component/uploadVideoCard";
import UploadDocsCard from "./component/uploadDocsCard";
import UploadQuestionCard from "./component/uploadQuestionCard";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import AxiosInstance from '../services/axios-instance'
import { useHistory } from "react-router-dom";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
const dotenv = require('dotenv');






export const CreateTrainPage = () => {
    const [radioInput, setRadioInput] = useState('Questions');
    const [name, setName] = useState('')
    const [link, setLink] = useState(null)
    const [points, setPoints] = useState(0)
    const [textContent, setTextContent] = useState('')
    const [captainUpId, setCaptainUpId] = useState('')
    const [actionName, setActionName] = useState('')
    const [badges, setTags] = useState([])
    const [goodFor, setGoodFor] = useState(0)
    const [fieldErr, setFieldErr] = useState(0)

    dotenv.config();



    let history = useHistory();

    const handleSubmit = async () => {
        if (name === "" || points === 0 ||  captainUpId === "" || actionName === "" || goodFor === 0){
            setFieldErr(1)
            console.log("error in fields")
        }else {
            if (link === null ){
                if (radioInput === "Questions"){
                    if(textContent === "") {
                        console.log("error in fields")
                        setFieldErr(1)
                    }else{
                        console.log("hello")
                        try {
                            let newTask = {
                                name: name,
                                // link: captainUpId + "." + typeFile,
                                points: points,
                                textContent: textContent,
                                type: radioInput,
                                captainUpId: captainUpId,
                                actionName: actionName,
                                badges: badges,
                                goodFor: goodFor
                            };


                            AxiosInstance.post('http://' + process.env.REACT_APP_URL + '/api/tasks/create', newTask)
                                .then(response => {
                                        if (response.status.toString().startsWith("2")) {
                                            console.log("succeed")
                                            history.push('/create')
                                        }
                                    }
                                ).catch(err => {
                                console.log("im in the status")
                            });
                        } catch (error) {
                            console.warn(error.message)
                        }
                    }

                }else{
                    console.log("error in fields")
                    setFieldErr(1)
                }
            }
            else {
                console.log(link.name)
                const typeFile = link.name.split(".").pop()
                const data = new FormData()
                data.append("file", link)

                AxiosInstance.post('http://' + process.env.REACT_APP_URL + '/api/tasks/upload?name=' + captainUpId + "."+ typeFile, data)
                    .then(response => {
                        if (response.status.toString().startsWith("2")) {
                            console.log("succeed")
                            history.push('/create')
                            try {
                                let newTask = {
                                    name: name,
                                    link: captainUpId + "." + typeFile,
                                    points: points,
                                    textContent: textContent,
                                    type: radioInput,
                                    captainUpId: captainUpId,
                                    actionName: actionName,
                                    badges: badges,
                                    goodFor: goodFor
                                };
                                console.log(typeFile)


                                AxiosInstance.post('http://' + process.env.REACT_APP_URL + '/api/tasks/create', newTask)
                                    .then(response => {
                                            if (response.status.toString().startsWith("2")) {
                                                console.log("succeed")
                                                history.push('/create')
                                            }
                                        }
                                    ).catch(err => {
                                    console.log("im in the status")
                                });
                            } catch (error) {
                                console.warn(error.message)
                            }
                        }
                    })
            }
        }

    };

    const createFileUpload = (event) => {
        console.log(event)
        setLink(event.target.files[0])

    };


    return (

        <div  className={styles["train-div"]} >
            <h1 className={styles.title} >הוספת הכשרה</h1>
            <div    >
                <FormControl  component="fieldset">
                    <FormLabel component="legend" className={styles.Form}>בחר סוג הכשרה:</FormLabel>
                    <RadioGroup row aria-label="position" name="position" defaultValue="top">
                        <FormControlLabel
                            value="Questions"
                            control={<Radio color="primary" />}
                            label="שאלות"
                            labelPlacement="top"
                            onClick={() => setRadioInput('Questions')}
                        />
                        <FormControlLabel
                            value="Video"
                            control={<Radio color="primary" />}
                            label="סרטון"
                            labelPlacement="top"
                            onClick={() => setRadioInput('Video')}
                        />
                        <FormControlLabel
                            value="Document"
                            control={<Radio color="primary" />}
                            label="קובץ קריאה"
                            labelPlacement="top"
                            onClick={() => setRadioInput('Document')}
                        />
                    </RadioGroup>
                </FormControl>
                {/*{ changeComp()}*/}<Typography variant="body2" color="textSecondary" component="p"
            >
                <h2>
                    <TextField
                        className={styles.inputTitle}
                        // onChange={}
                        id={"filled-textarea"}
                        placeholder="כותרת"
                        multiline
                        variant="filled"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => setName(event.target.value)}
                    />
                </h2>
                <TextField
                    className={styles.inputText}
                    // onChange={}
                    id="standard-full-width"
                    placeholder="תוכן"
                    multiline
                    rows={5}
                    variant="filled"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => setTextContent(event.target.value)}

                />
                <div className={styles.inputInline}>
                <TextField
                    type='number'
                    id={"standard-basic"}
                    className='form-control'
                    pattern='[0-9]{0,5}'
                    placeholder="נקודות"
                    onChange={(event) => setPoints(event.target.value)}

                />
                    <TextField
                        id={"standard-basic"}
                        className='form-control'
                        pattern='[A-Za-z]'
                        placeholder="captain up name"
                        onChange={(event) => setCaptainUpId(event.target.value)}

                    />
                    <TextField
                        id={"standard-basic"}
                        className='form-control'
                        pattern='[A-Za-z]'
                        placeholder="Action name"
                        onChange={(event) => setActionName(event.target.value)}

                    />
                    <TextField
                        type='number'
                        id={"standard-basic"}
                        className='form-control'
                        pattern='[0-9]{0,5}'
                        placeholder="משך תוקף ההכשרה"
                        onChange={(event) => setGoodFor(event.target.value)}

                    />
                </div>
            </Typography>
                <Button
                    variant="contained"
                    className={styles.button}
                    component={"label"}
                    startIcon={<AttachFileIcon />}
                    type='file'
                    size="large"

                >
                    <input id="icon-button-file" type="file" onChange={(event) => createFileUpload(event)} hidden/>
                    צרף קובץ
                </Button>
                <Button className={styles.finish} onClick={() => handleSubmit()}  >
                    סיימתי
                </Button>
                {fieldErr ? <h3>ישנה בעיה בפרטים שמילאת, אנא מלא שוב, או תקן את השדות. </h3> : ""}
            </div>
        </div>
    );
}

