import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from "./createTrainCard.module.css";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import TextField from "@material-ui/core/TextField";


export default function UploadQuestionCard() {

    return (
        <Card >
            <CardContent>
               
            <div className={styles.textContainer}>
                                <Typography variant="body2" color="textSecondary" component="p"
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
                                        />
                                    </h2>
                                    <TextField
                                        className={styles.inputText}
                                        // onChange={}
                                        id="standard-full-width"
                                        placeholder=" הכותרת"
                                        multiline
                                        rows={5}
                                        variant="filled"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Typography>
                <TextField
                    type='number'
                    id={"standard-basic"}
                    className='form-control'
                    pattern='[0-9]{0,5}'
                    value={"נקודות"}
                    placeholder="נקודות"

                />
                            </div>


            </CardContent>
            
        </Card>
    );
}
