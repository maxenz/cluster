import React from 'react'
import {Table} from 'semantic-ui-react';
import moment from 'moment';
import {getColorByValue, materialsList, requestStatesList} from "./requestsList";
import ActionButtons from "./ActionButtons";
import Countdown from 'react-countdown-now';
import {REQUESTS_STATUS_PRINTING} from "../../constants/requests";

const styles = {
  table: {
    width: '80%',
    marginLeft: '10%',
  }
};

const RequestsTable = (props) => {

  const {
    requests,
    authUser,
    handleQuoteRequest,
    handleAcceptQuote,
    handleRejectQuote,
    handleStartPrinting,
    handleFinishPrinting
  } = props;

  return (
      <div>
        <Table style={styles.table} striped celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Número de pedido</Table.HeaderCell>
              <Table.HeaderCell width={1}>Color</Table.HeaderCell>
              <Table.HeaderCell>Material</Table.HeaderCell>
              <Table.HeaderCell width={2}>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Importe</Table.HeaderCell>
              <Table.HeaderCell>Trab. listo en</Table.HeaderCell>
              <Table.HeaderCell/>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              !requests ? null :
                  Object.values(requests).map((request) => {
                    const pendingMinutes = moment(request.finish_printing_time).diff(moment(), 'minutes', true);
                    return <Table.Row key={request._id}>
                      <Table.Cell>{request._id}</Table.Cell>
                      <Table.Cell>
                        <div className={`color-circle ${getColorByValue(request.color_type)}`}></div>
                      </Table.Cell>
                      <Table.Cell>{materialsList.find(x => x.value === request.material_type).text}</Table.Cell>
                      <Table.Cell>{moment(request.create_date).format('DD/MM/YYYY hh:mm')}</Table.Cell>
                      <Table.Cell>{requestStatesList.find(x => x.value === request.status).text}</Table.Cell>
                      <Table.Cell>
                        {request.price && request.price.amount && `$${request.price.amount}` || ''}
                      </Table.Cell>
                      <Table.Cell>
                        {
                          request.status === REQUESTS_STATUS_PRINTING ?
                              <Countdown date={Date.now() + (pendingMinutes * 60000)}/> : null
                        }
                      </Table.Cell>
                      <Table.Cell style={{textAlign: 'center'}}>
                        <ActionButtons
                            request={request}
                            authUser={authUser}
                            handleQuoteRequest={handleQuoteRequest}
                            handleAcceptQuote={handleAcceptQuote}
                            handleRejectQuote={handleRejectQuote}
                            handleStartPrinting={handleStartPrinting}
                            handleFinishPrinting={handleFinishPrinting}
                            pendingMinutes={pendingMinutes}
                        />
                      </Table.Cell>
                    </Table.Row>
                  })
            }
          </Table.Body>
        </Table>
      </div>
  );


};


export default RequestsTable;