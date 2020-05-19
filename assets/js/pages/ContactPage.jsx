import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Header from '../components/Header';
const Contact = props => {


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    return (
        
       
<React.Fragment>
     <Header title="Contactez-nous !"/>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="Nom"
            name="Nom"
            label="Nom"
            fullWidth
            autoComplete="fNom"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="prenom"
            name="prenom"
            label="Prénom"
            fullWidth
            autoComplete="lprenom"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="mail"
            name="mail"
            label="Addresse mail"
            fullWidth
            autoComplete="billing address-line2"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="message"
            name="message"
            label="Votre message"
            fullWidth
            autoComplete="Message"
          />
        </Grid>
        <Grid item xs={12}>
        <Button variant="contained" color="primary">
        Envoyer
        </Button>



        <Grid item xs={3}  style={{ marginTop: 20 }}>
        <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        S'abonner aux NewsLetters
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">S'abonner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Inscrivez votre Email pour recevoir toutes les informations sur nos conférences.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuller
          </Button>
          <Button onClick={handleClose} color="primary">
            S'abonner
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </Grid>


        </Grid>
      </Grid>
    </React.Fragment>
    )
}

export default Contact;