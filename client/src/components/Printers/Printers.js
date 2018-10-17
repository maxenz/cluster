import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
  Button,
  Icon,
  Modal,
  Header,
  Container
} from 'semantic-ui-react';
import PrintersTable from "./PrintersTable";
import PrinterForm from "./PrinterForm";
import {PRINTER_STATUS_ENABLED} from "../../constants/printers";
import {getPrinters, savePrinter, removePrinter} from "../../actions/printers";
import PrinterImage from '../../images/printer.png';
import Loader from '../Loader';

const source = [];

const styles = {
  addButton: {
    float: 'right',
    marginRight: '10%',
    marginTop: '10px',
  },
};

class Printers extends React.Component {

  constructor(props) {
    super(props);
    this._initState = {
      printer: {
        name: '',
        status: PRINTER_STATUS_ENABLED,
      },
      error: null,
      showForm: false,
      selectedId: null,
    };
    this.state = this._initState;
  }

  cleanState = () => {
    const newState = {...this._initState, printer: {name: '', status: PRINTER_STATUS_ENABLED}};
    this.setState(newState);
  };

  savePrinter = () => {
    this.setState({isSaving: true});
    this.props.savePrinter(this.state.printer)
        .then(() => {
          this.cleanState();
        });
  };

  handleEditPrinter = (id) => {
    const printer = this.props.printers[id];
    this.setState({
      ...this.state,
      showForm: true,
      printer,
    });
  };

  handleRemovePrinter = (selectedId) => {
    this.setState({selectedId});
    this.handleOpenModal();
  };

  confirmRemovePrinter = () => {
    this.props.removePrinter(this.state.selectedId)
        .then(() => {
          this.handleCloseModal();
          this.cleanState();
        });
  };

  cancelSavePrinter = () => {
    this.cleanState();
  };

  handleChange = (property, value) => {
    let newState = Object.assign({}, this.state);
    newState.printer[property] = value;
    this.setState(newState);
  };

  handleOpenModal = () => this.setState({modalOpen: true});

  handleCloseModal = () => this.setState({modalOpen: false});

  renderModal = () => {
    return <Modal
        basic
        size='small'
        open={this.state.modalOpen}
        onClose={this.handleCloseModal}
    >
      <Header icon='archive' content='Eliminar impresora'/>
      <Modal.Content>
        <p>
          Está seguro que desea eliminar la impresora del sistema?
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={this.handleCloseModal}>
          <Icon name='remove'/> No
        </Button>
        <Button color='green' inverted onClick={this.confirmRemovePrinter}>
          <Icon name='checkmark'/> Si
        </Button>
      </Modal.Actions>
    </Modal>
  };

  componentDidMount() {
    this.props.getPrinters();
  }

  componentWillMount() {
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  addPrinter = () => {
    this.setState({showForm: true});
  };

  handleGoBack = () => {
    this.cleanState();
  };

  render() {
    const {printers} = this.props;
    const {showForm} = this.state;
    const formIsInvalid = this.state.printer.name === '';

    return (
        <Loader
            text="Cargando impresoras..."
            image={PrinterImage}
            showLoader={printers === null}
        >
          <Container>
            {
              showForm ?
                  <PrinterForm
                      printer={this.state.printer}
                      savePrinter={this.savePrinter}
                      cancelSavePrinter={this.cancelSavePrinter}
                      handleChange={this.handleChange}
                      handleGoBack={this.handleGoBack}
                      formIsInvalid={formIsInvalid}
                      error={this.state.error}
                  /> :
                  <div>
                    {
                      printers &&
                      <div style={{marginTop: '10%'}}>
                        <PrintersTable
                            printers={Object.values(printers)}
                            handleEditPrinter={this.handleEditPrinter}
                            handleRemovePrinter={this.handleRemovePrinter}/>
                        <Button
                            onClick={this.addPrinter}
                            icon
                            labelPosition='left'
                            color='orange'
                            size='small'
                            style={styles.addButton}>
                          <Icon name='plus circle'/> Agregar Impresora
                        </Button>
                      </div>
                    }
                  </div>
            }
          </Container>
          {this.renderModal()}
        </Loader>
    )
  }
}

const mapStateToProps = state => ({
  printers: state.printers.all,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {
  getPrinters,
  savePrinter,
  removePrinter,
};

Printers.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Printers));
