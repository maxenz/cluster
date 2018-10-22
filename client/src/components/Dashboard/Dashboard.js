import React from 'react';
import {connect} from 'react-redux';
import PrinterCard from './PrinterCard';
import {Grid, GridColumn} from 'semantic-ui-react';
import MaterialSemanalUse from './MaterialSemanalUse';
import moment from 'moment';
import {
  MATERIAL_ABS,
  MATERIAL_FLEX,
  MATERIAL_PLA,
  REQUESTS_STATUS_DONE,
  REQUESTS_STATUS_PRINTING,
  REQUESTS_STATUS_READY_TO_DELIVER
} from "../../constants/requests";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {getPrinters} from "../../actions/printers";
import {getRequests} from "../../actions/requests";

const style = {
  printerCards: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%',
  }
};

export class Dashboard extends React.Component {

  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.props.getPrinters();
    this.props.getRequests();
  }

  getMaterialUse = (reqs, mat) => {
    return reqs.filter(r => r.material_type === mat).reduce((sum, obj) => {
      return sum + parseInt(obj.diameter);
    }, 0);
  };

  getPrintersInfo = () => {
    const printers = Object.values(this.props.printers);
    const requests = Object.values(this.props.requests);
    let printersInfo = [];
    printers.forEach(printer => {
      const reqMade = requests.filter(
          r => r.selected_printer_id === printer._id &&
              (r.status === REQUESTS_STATUS_READY_TO_DELIVER || r.status === REQUESTS_STATUS_DONE))
          .length;
      const actualRequest = requests.filter(r => r.status === REQUESTS_STATUS_PRINTING && r.selected_printer_id === printer._id);
      const pendingMinutes = actualRequest.length > 0 ? moment(actualRequest[0].finish_printing_time).diff(moment(), 'minutes', true) : 0;
      const info = {
        pendingMinutes,
        printer,
        reqMade,
        actualRequest: actualRequest.length > 0 ? actualRequest[0] : null,
      };
      printersInfo = [...printersInfo, info];
    });
    return printersInfo;
  };

  getSemanalUse = () => {
    const requests = Object.values(this.props.requests);
    const semanalRequests = requests.filter(r => moment().diff(moment(r.start_printing_time), 'days', true) < 7);
    const abs = this.getMaterialUse(semanalRequests, MATERIAL_ABS);
    const flex = this.getMaterialUse(semanalRequests, MATERIAL_FLEX);
    const pla = this.getMaterialUse(semanalRequests, MATERIAL_PLA);

    return [abs, flex, pla];
  };

  componentWillMount() {
    if (!this.props.isAuthenticated || (this.props.isAuthenticated && !this.props.auth.user.admin)) {
      this.props.history.push('/login');
    }
  }

  render() {
    const {requests, printers} = this.props;
    return (
        <div>
          {
            requests && printers &&
            <div>
              <MaterialSemanalUse uses={this.getSemanalUse()}/>
              <div style={style.printerCards}>
                <Grid>
                {this.getPrintersInfo().map(info =>
                    <GridColumn key={Math.random()} width={5}>
                      <PrinterCard info={info}/>
                    </GridColumn>
                )}
                </Grid>
              </div>
            </div>
          }
        </div>)
  }
}

const mapStateToProps = state => ({
  printers: state.printers.all,
  requests: state.requests.all,
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth,
});

const mapDispatchToProps = {
  getPrinters,
  getRequests,
};

Dashboard.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));