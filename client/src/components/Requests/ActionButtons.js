import React from "react";
import { Button } from "semantic-ui-react";
import {
  REQUESTS_STATUS_PRINTING,
  REQUESTS_STATUS_QUOTE_ACCEPTED,
  REQUESTS_STATUS_QUOTE_REJECTED,
  REQUESTS_STATUS_QUOTED_BY_ADMIN,
  REQUESTS_STATUS_READY_TO_PRINT,
  REQUESTS_STATUS_SENT_BY_USER
} from "../../constants/requests";

const doubleButtonsStyle = {
  fontSize: "10px"
};

const getButtons = (props, admin) => {
  const request = props.request;
  switch (request.status) {
    case REQUESTS_STATUS_SENT_BY_USER:
      return (
        admin && (
          <Button
            positive
            size="mini"
            onClick={() => props.handleQuoteRequest(request._id)}
          >
            Cotizar
          </Button>
        )
      );
    case REQUESTS_STATUS_QUOTED_BY_ADMIN:
      return (
        !admin && (
          <div style={{ display: "flex" }}>
            <Button
              style={doubleButtonsStyle}
              positive
              size="mini"
              onClick={() => props.handleAcceptQuote(request._id)}
            >
              Aceptar cotización
            </Button>
            <Button
              style={doubleButtonsStyle}
              negative
              size="mini"
              onClick={() => props.handleRejectQuote(request._id)}
            >
              Rechazar cotización
            </Button>
          </div>
        )
      );
    case REQUESTS_STATUS_READY_TO_PRINT:
      return (
        admin && (
          <Button
            positive
            size="mini"
            onClick={() => props.handleStartPrinting(request._id)}
          >
            Comenzar impresión
          </Button>
        )
      );
    case REQUESTS_STATUS_PRINTING:
      return admin ? (
        <div style={{ display: "flex" }}>
          <Button
            style={doubleButtonsStyle}
            positive
            size="mini"
            onClick={() => props.handleFinishPrinting(request._id)}
          >
            Finalizar impresión
          </Button>
          <Button
            style={doubleButtonsStyle}
            negative
            size="mini"
            onClick={() => props.handleCancelRequest(request._id)}
          >
            Cancelar
          </Button>
        </div>
      ) : null;
    case REQUESTS_STATUS_QUOTE_ACCEPTED:
      return (
        !admin && (
          <Button
            positive
            size="mini"
            onClick={() => props.handlePayRequest(request._id)}
          >
            Pagar
          </Button>
        )
      );
    case REQUESTS_STATUS_QUOTE_REJECTED:
      return (
        admin && (
          <Button
            positive
            size="mini"
            onClick={() => props.handleQuoteRequest(request._id)}
          >
            Volver a cotizar
          </Button>
        )
      );
    default:
      return null;
  }
};

const ActionButtons = props => {
  return getButtons(props, props.authUser.admin);
};

export default ActionButtons;
