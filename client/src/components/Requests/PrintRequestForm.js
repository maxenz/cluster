import React from 'react'
import {Form, Button, Dropdown, Segment, Label} from 'semantic-ui-react';
import {PRINTER_STATUS_ENABLED} from "../../constants/printers";
import BackButton from "../Common/BackButton";

const PrintRequestForm = (props) => {

  const {printers, request, updateRequest, handleSelectedPrinterChange} = props;

  const arr = printers ? Object.values(printers) : [];

  const printersDropdown = arr
      .filter(p => p.status === PRINTER_STATUS_ENABLED)
      .map(p => {
        return {
          value: p._id,
          text: p.name,
        };
      });

  return (
      <div style={{marginTop: '8%'}}>
        <BackButton handleGoBack={props.handleGoBack}/>
        <Form error size='large' onSubmit={() => updateRequest(request._id)}
              style={{width: '50%', marginLeft: 'auto', marginRight: 'auto'}}>
          <div style={{
            height: '50px',
            width: '100%',
            backgroundColor: '#f2711c',
            textAlign: 'center'
          }}>
            <h3 style={{color: 'white', lineHeight: '50px', fontSize: '20px'}}>
              Imprimir pedido
            </h3>
          </div>
          <Segment stacked style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginTop: 0
          }}>

            <h3>Impresora Sugerida</h3>

            <Dropdown
                className="formElement"
                fluid
                selection
                value={request ? request.selected_printer_id : 1}
                options={printersDropdown}
                onChange={(event, data) => handleSelectedPrinterChange(data.value)}
            />

            <Button color='orange' fluid size='large'>Comenzar</Button>

          </Segment>
        </Form>
      </div>
  );
};

export default PrintRequestForm;