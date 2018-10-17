import React from 'react'
import {Form, Button, Dropdown, Segment, Message} from 'semantic-ui-react';
import {printersList} from './printersList';
import BackButton from "../Common/BackButton";

const PrinterAddForm = (props) => {

  const {printer, isSaving, formIsInvalid, handleGoBack, error} = props;

  return (
      <div style={{marginTop: '10%'}}>
        <BackButton handleGoBack={handleGoBack}/>
        <Form error size='large' onSubmit={props.savePrinter}
              style={{width: '50%', marginLeft: 'auto', marginRight: 'auto'}}>
          <div style={{
            height: '50px',
            width: '100%',
            backgroundColor: '#f2711c',
            textAlign: 'center'
          }}>
            <h3 style={{color: 'white', lineHeight: '50px', fontSize: '20px'}}>
              {printer._id ? "Editar Impresora" : "Agregar impresora"}
            </h3>
          </div>
          <Segment stacked style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginTop: 0
          }}>

            <Form.Input
                fluid
                placeholder='Nombre'
                type='text'
                icon='print'
                iconPosition='left'
                value={printer.name}
                onChange={event => props.handleChange('name', event.target.value)}/>

            <Dropdown
                className="formElement"
                placeholder="Estado"
                fluid
                selection
                value={printer.status}
                options={printersList}
                onChange={(event, data) => props.handleChange('status', data.value)}
            />

            <Button style={{marginTop: '5%'}} color='orange' fluid size='large'
                    disabled={formIsInvalid || isSaving}>Guardar</Button>

            {error ?
                <Message error header='Error' content={error.message}/> : null}

          </Segment>
        </Form>
      </div>
  );
};


export default PrinterAddForm;