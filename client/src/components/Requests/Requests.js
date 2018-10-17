import React from 'react';
import RequestsTable from "./RequestsTable";
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Button, Icon} from 'semantic-ui-react';
import Loader from '../Loader';
import LoadingRequestsImage from '../../images/3dprinting.png';
import QuotingForm from "./QuotingForm";
import PrintRequestForm from './PrintRequestForm';
import {
  REQUESTS_STATUS_PRINTING,
  REQUESTS_STATUS_QUOTE_REJECTED, REQUESTS_STATUS_QUOTED_BY_ADMIN,
  REQUESTS_STATUS_READY_TO_DELIVER, REQUESTS_STATUS_READY_TO_PRINT
} from
      "../../constants/requests";
// import {getFileUrl} from
// "../../firebase/storage"; import PrintRequestForm from
// '../requests/PrintRequestForm';
import {
  PRINTER_STATUS_ENABLED,
  PRINTER_STATUS_WORKING
} from "../../constants/printers";
import {connect} from "react-redux";
import {getRequests, removeRequest, saveRequest} from "../../actions/requests";
import {getPrinters, savePrinter} from "../../actions/printers";
import CreateEditRequestForm from "./CreateEditRequestForm";
// import getArrayFromObject from "../../helpers/helpers";

const styles = {
  addButton: {
    float: 'right',
    marginRight: '10%',
    marginTop: '10px',
  },
};

export class Requests extends React.Component {

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);
    this._initState = {
      showCreateEditForm: false,
      showPrintingForm: false,
      showQuoteForm: false,
      showRequestsTable: true,
      request: {
        price: {
          amount: '',
        }
      }
    };
    this.state = this._initState;
  }

  cleanState = () => {
    this.setState(this._initState);
  };

  componentWillMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  componentDidMount() {
    this.props.getRequests();
    this.props.getPrinters();
  }

  addRequest = () => {
    this.setState({
      showCreateEditForm: true,
      showRequestsTable: false
    });
  };

  handleQuoteRequest = (id) => {
    const request = this.props.requests[id];
    this.setState({showRequestsTable: false, showQuoteForm: true, request});
    // const request = {...this.props.requests[id], id};
    // getFileUrl(request.file_name)
    //     .then((url) => {
    //       this.setState({showQuoteRequest: true, showRequestsTable: false,
    // request, fileUrl: url}); });
  };

  handleFormChange = (name, value) => {
    const request = {...this.state.request, [name]: value};
    this.setState({...this.state, request});
  };

  handleAcceptQuote = (id) => {
    const request = this.props.requests[id];
    this.props.saveRequest({
      ...request, status:
      REQUESTS_STATUS_READY_TO_PRINT
    });
  };

  handleRejectQuote = (id) => {
    const request = this.props.requests[id];
    this.props.saveRequest({
      ...request, status:
      REQUESTS_STATUS_QUOTE_REJECTED,
    });
  };

  handleSaveQuoteRequest = () => {
    this.props.saveRequest({
      ...this.state.request,
      status: REQUESTS_STATUS_QUOTED_BY_ADMIN,
    }).then(() => {
      this.setState({showQuoteForm: false, showRequestsTable: true});
    });
  };

  handleStartPrinting = (id) => {
    const availablePrinters = Object
        .values(this.props.printers)
        .filter(x => x.status === PRINTER_STATUS_ENABLED);
    const request = {
      ...this.props.requests[id],
      selected_printer_id: availablePrinters[0]._id
    };
    this.setState({showRequestsTable: false, showPrintingForm: true, request});
  };

  handleFinishPrinting = (id) => {
    const request = this.props.requests[id];
    this.props.saveRequest({
      ...request,
      status: REQUESTS_STATUS_READY_TO_DELIVER,
    }).then(() => {
      this.props.savePrinter({
        ...this.printers[request.selected_printer_id],
        status: PRINTER_STATUS_ENABLED
      });
    });
  };

  handleUpdateStartPrinting = (id) => {
    const request = this.props.requests[id];
    this.props.saveRequest({
      ...request,
      status: REQUESTS_STATUS_PRINTING,
      start_printing_time: new Date(),
      finish_printing_time: moment()
          .add(this.state.request.total_printing_time, 'minutes')
          .toDate(),
    }).then(() => {
      this.props.savePrinter({
        ...this.props.printers[this.state.request.selected_printer_id],
        status: PRINTER_STATUS_WORKING
      }).then(() => {
        this.cleanState();
      });
    });
  };

  handleSelectedPrinterChange = (value) => {
    const request = {...this.state.request, selected_printer_id: value};
    this.setState({...this.state, request});
  };

  render() {
    const {showRequestsTable, showQuoteForm, showPrintingForm, showCreateEditForm, request} = this.state;
    const {requests, auth} = this.props;

    return (
        <Loader
            text="Cargando pedidos..."
            image={LoadingRequestsImage}
            showLoader={requests === null}
        >
          {
            showRequestsTable && requests &&
            <div style={{marginTop: '8%'}}>
              <RequestsTable
                  requests={requests}
                  authUser={auth.user}
                  handleQuoteRequest={this.handleQuoteRequest}
                  handleAcceptQuote={this.handleAcceptQuote}
                  handleStartPrinting={this.handleStartPrinting}
                  handleRejectQuote={this.handleRejectQuote}
                  handleFinishPrinting={this.handleFinishPrinting}>
              </RequestsTable>

              <Button onClick={this.addRequest} icon labelPosition='left'
                      color='orange' size='small' style={styles.addButton}>
                <Icon name='plus circle'/> Agregar Pedido
              </Button>
            </div>
          }
          {
            request && showQuoteForm &&
            <QuotingForm
                handleSaveQuoteRequest={this.handleSaveQuoteRequest}
                handleFormChange={this.handleFormChange}
                fileUrl={this.state.fileUrl}
                formIsInvalid={this.state.request.price === '' || !this.state.request.total_printing_time}
                request={request}
                handleGoBack={this.cleanState}
            >
            </QuotingForm>
          }
          {
            showPrintingForm &&
            <PrintRequestForm
                request={request}
                updateRequest={this.handleUpdateStartPrinting}
                handleSelectedPrinterChange={this.handleSelectedPrinterChange}
                printers={this.props.printers}
                handleGoBack={this.cleanState}
            >
            </PrintRequestForm>
          }
          {
            showCreateEditForm &&
            <CreateEditRequestForm
                cleanState={this.cleanState}
                handleGoBack={this.cleanState}
                saveRequest={this.props.saveRequest}/>
          }
        </Loader>
    )

  }
}

const mapStateToProps = state => ({
  printers: state.printers.all,
  requests: state.requests.all,
  auth: state.auth,
});

const mapDispatchToProps = {
  getRequests,
  saveRequest,
  removeRequest,
  getPrinters,
  savePrinter,
};

Requests.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Requests));