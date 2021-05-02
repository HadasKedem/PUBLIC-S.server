import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from "./createTrainCard.module.css";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import TextField from "@material-ui/core/TextField";


export default function UploadVideoCard() {

    return (
        <Card >
            <CardContent>

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
                    /><TextField
                    type='number'
                    id={"standard-basic"}
                    className='form-control'
                    pattern='[0-9]{0,5}'
                    value={"נקודות"}
                    placeholder="נקודות"

                />
                </h2>
                <label htmlFor="contained-button-file">
                <Button
                    variant="contained"
                    className={styles.button}
                    component={"span"}
                    startIcon={<AttachFileIcon />}
                >
                    צרף קובץ
                </Button>
            </label>

            </CardContent>
            
        </Card>
    );
}
