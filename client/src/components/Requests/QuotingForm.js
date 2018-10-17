import React from 'react'
import {Form, Button, Segment, Message} from 'semantic-ui-react';
import BackButton from "../Common/BackButton";

const QuotingForm = (props) => {

  const {request, formIsInvalid, handleSaveQuoteRequest, fileUrl} = props;

  return (
      <div style={{marginTop: '7%'}}>
        <BackButton handleGoBack={props.handleGoBack}/>
        <div style={{
          width: '50%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <Message color='blue'>
            Podés descargar el archivo adjunto a este pedido haciendo click <a
              href={fileUrl} download>acá</a>
          </Message>
          <Form error size='large' onSubmit={handleSaveQuoteRequest}>
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
              }}>
                Cotizar impresión
              </h3>
            </div>
            <Segment stacked style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              marginTop: 0
            }}>

              <Form.Input
                  fluid
                  placeholder='Precio'
                  name='price'
                  type='number'
                  icon='dollar sign'
                  iconPosition='left'
                  value={request.price || ''}
                  onChange={event => props.handleFormChange(event.target.name, event.target.value)}/>

              <Form.Input
                  fluid
                  placeholder='Tiempo en minutos'
                  name='total_printing_time'
                  type='number'
                  icon='clock'
                  iconPosition='left'
                  value={request.total_printing_time || ''}
                  onChange={event => props.handleFormChange(event.target.name, event.target.value)}/>

              <Button disabled={formIsInvalid} color='orange' fluid
                      size='large'>Cotizar</Button>

            </Segment>
          </Form>
        </div>
      </div>
  );
};

export default QuotingForm;