import React, {Component} from 'react';
import {
  Form,
  Segment,
  Button,
  Message,
  Icon,
  Label,
  Dropdown
} from 'semantic-ui-react';
import FileReaderInput from '../../../node_modules/react-file-reader-input';
import {REQUESTS_STATUS_SENT_BY_USER} from "../../constants/requests";
import {colorsList, materialsList} from "./requestsList";
// import {uploadRequestFile} from "../../firebase/storage";
import moment from "moment/moment";
import BackButton from "../Common/BackButton";

const styles = {
  backgroundColor: '#FFF',
  header: {
    fontFamily: 'Josefin Sans, cursive',
    fontSize: '2.5rem',
  },
  file: {
    label: {
      backgroundColor: '#f2711c',
      marginTop: '5px',
      color: '#FFF',
    }
  },
  fileButton: {
    marginBottom: '10px',
    display: '-webkit-inline-box',
  }
};

const successMessageStyle = {
  width: '50%',
  marginLeft: 'auto',
  marginRight: 'auto',
};

class CreateEditRequestForm extends Component {

  constructor(props) {
    super(props);
    this._initState = {
      diameter: '',
      materialType: '',
      colorType: '',
      uploadedFile: null,
      error: null,
      isSaving: false,
      requestWasSent: false,
    };
    this.state = this._initState;
  }

  cleanState = () => {
    this.setState(this._initState);
  };

  handleChange = (property, value) => {
    let newState = Object.assign({}, this.state);
    newState[property] = value;
    this.setState(newState);
  };

  clearError = () => this.setState({error: null});

  handleFileChange = (e, results) => {
    const [pgEvent, file] = results[0];
    if (file.name.toUpperCase().endsWith('STL')) {
      this.setState({uploadedFile: file, fileName: `${moment()}_${file.name}`});
      this.clearError();
    }
    else {
      this.setState({error: {message: 'Debe subir un archivo con formato .stl'}})
    }
  };

  onSubmit = () => {
    if (this.formIsInvalid()) {
      return;
    }
    this.setState({...this.state, isSaving: true,});
    const {colorType, materialType, diameter, uploadedFile, fileName} = this.state;
    this.props.saveRequest(
        {
          color_type: colorType,
          material_type: materialType,
          diameter,
          created_by: 1,
          file_name: fileName,
          status: REQUESTS_STATUS_SENT_BY_USER,
          create_date: Date.now(),
          price: 0,
        }).then(() => {
      this.props.cleanState();
    })
    // .then(() => {
    //   uploadRequestFile(uploadedFile, fileName).then(() => {
    //     this.setState({
    //       ...this.state,
    //       isSaving: false,
    //       requestWasSent: true
    //     });
    //   });
    // });
  };

  formIsInvalid = () => {
    const {
      uploadedFile,
      colorType,
      materialType,
      diameter,
    } = this.state;

    const isInvalid =
        colorType === '' ||
        diameter === '' ||
        materialType === '' ||
        uploadedFile === null;

    return isInvalid;

  };

  render() {

    const {
      uploadedFile,
      colorType,
      materialType,
      diameter,
      error,
      isSaving,
      requestWasSent,
    } = this.state;


    return (
        <div style={{marginTop: '7%'}}>
          <BackButton handleGoBack={this.props.handleGoBack}/>
          {
            !requestWasSent ?

                <Form error size='large' onSubmit={this.onSubmit}
                      style={{
                        width: '50%',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }}>
                  <div style={{
                    height: '50px',
                    width: '100%',
                    backgroundColor: '#f2711c',
                    textAlign: 'center'
                  }}>
                    <h3 style={{
                      color: 'white',
                      lineHeight: '50px',
                      fontSize: '20px'
                    }}>Generar pedido</h3>
                  </div>
                  <Segment stacked style={{
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    marginTop: 0
                  }}>

                    <Dropdown
                        className="formElement"
                        placeholder="Tipo de material"
                        fluid
                        selection
                        value={materialType}
                        options={materialsList}
                        onChange={(event, data) => this.handleChange('materialType', data.value)}
                    />

                    <Dropdown
                        className="formElement"
                        placeholder="Color"
                        fluid
                        selection
                        value={colorType}
                        options={colorsList}
                        onChange={(event, data) => this.handleChange('colorType', data.value)}
                    />

                    <Form.Input
                        fluid
                        placeholder='Diámetro (cm.)'
                        type='text'
                        icon='resize vertical'
                        iconPosition='left'
                        value={diameter}
                        onChange={event => this.handleChange('diameter', event.target.value)}/>

                    <div className="formElement" style={styles.fileButton}>
                      <FileReaderInput as="binary" id="my-file-input"
                                       onChange={this.handleFileChange}>
                        <Button icon labelPosition='left'>
                          <Icon name='attach'/>
                          Seleccione un archivo
                        </Button>
                      </FileReaderInput>
                      {
                        uploadedFile ?
                            <Label style={styles.file.label} as='a'>
                              <Icon name='attach'/>
                              {uploadedFile.name}
                            </Label> : null
                      }
                    </div>

                    <Button color='orange' fluid size='large'
                            disabled={this.formIsInvalid() || isSaving}>Generar</Button>

                    {error ? <Message error header='Error'
                                      content={error.message}/> : null}

                  </Segment>
                </Form>
                : <Message
                    icon='checkmark'
                    success
                    style={successMessageStyle}
                    header='La petición de impresión fue enviada correctamente.'
                    content='Se le enviará un email de aviso cuando la cotización esté lista.'
                />
          }
        </div>
    );
  }
}

export default CreateEditRequestForm;