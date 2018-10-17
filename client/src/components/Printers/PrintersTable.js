import React from 'react'
import {Table, Button, Icon} from 'semantic-ui-react';
import {getPrinterStatusByValue} from './helpers';

const styles = {
  table: {
    width: '80%',
    marginLeft: '10%',
  }
};

const PrintersTable = (props) => {
  const {printers, handleEditPrinter, handleRemovePrinter} = props;

  return (
    <div>
      <Table style={styles.table} striped celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            {/*<Table.HeaderCell>Trab. Pendientes</Table.HeaderCell>*/}
            <Table.HeaderCell>Estado</Table.HeaderCell>
            {/*<Table.HeaderCell>Tiempo de liberación</Table.HeaderCell>*/}
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            !printers ? null :
              Object.values(printers).map(printer => {
                const statusObj = getPrinterStatusByValue(printer.status);
                return <Table.Row key={Math.random()}>
                  <Table.Cell>{printer.name}</Table.Cell>
                  {/*<Table.Cell>21</Table.Cell>*/}
                  <Table.Cell className={statusObj.className}>{statusObj.label}</Table.Cell>
                  {/*<Table.Cell>*/}
                  {/*<Countdown*/}
                  {/*date={Date.now() + 50000}>*/}
                  {/*</Countdown>*/}
                  {/*</Table.Cell>*/}
                  <Table.Cell style={{textAlign: 'center'}}>
                    <Button icon size='mini' onClick={() => handleEditPrinter(printer._id)}>
                      <Icon name='edit' />
                    </Button>
                    <Button color='red' icon size='mini' onClick={() => handleRemovePrinter(printer._id)}>
                      <Icon name='trash alternate outline' />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              })
          }
        </Table.Body>
      </Table>
    </div>
  );
};

export default PrintersTable;