import React from "react";
import { Table, Label, Pagination, Icon, Input } from "semantic-ui-react";
import moment from "moment";
import {
  getColorByValue,
  materialsList,
  requestStatesList
} from "./requestsList";
import ActionButtons from "./ActionButtons";
import Countdown from "react-countdown-now";
import { REQUESTS_STATUS_PRINTING } from "../../constants/requests";

const styles = {
  table: {
    width: "80%",
    marginLeft: "10%"
  },
  paginator: {
    marginLeft: "10%"
  }
};

export default class RequestsTable extends React.Component {
  pagination = { pageSize: 10, activePage: 1, totalPages: 0 };

  constructor(props) {
    super(props);

    this.state= {
      query: '',
      pagedRequests: []
    };
  }

  componentDidMount() {
    this.processPage()
  }

  processPage = () => {
    let list = Object.values(this.props.requests);
    let query = this.state.query;
    if(this.state.query !== ''){
      list = list.filter((val)=>{
        let row = val._id + '|' + val.color_type + '|' + materialsList.find(x => x.value === val.material_type).text + '|' + moment(val.create_date).format("DD/MM/YYYY hh:mm") + '|' + requestStatesList.find(x => x.value === val.status).text;

        return row.toLocaleLowerCase().includes(query.toLocaleLowerCase());
      });
    }

    this.pagination.totalPages = list.length / this.pagination.pageSize;
    let from = (this.pagination.activePage - 1) * this.pagination.pageSize;
    let to = from + this.pagination.pageSize;

    list = list.filter((val, index) => { return index >= from && index < to; });

    this.setState({
      pagedRequests: list
    })
  }

  changePage = (e, { activePage }) => {
    this.pagination.activePage = activePage;
    this.processPage();
  }

  handleChange = (e) => {
    this.setState({ query: e.target.value },()=>{
      this.processPage();
    });    
  }

  render() {
    return (
      <div>
        <Input style={styles.paginator}
          action={{ color: "orange", labelPosition: "right", icon: "search", content: "Buscar" }}
          placeholder="Search..."
          value={this.state.query}
          onChange={ this.handleChange }
        />
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
              <Table.HeaderCell />
              <Table.HeaderCell>Archivo</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.pagedRequests.map(request => {
              const pendingMinutes = moment(
                request.finish_printing_time
              ).diff(moment(), "minutes", true);
              return (
                <Table.Row key={request._id}>
                  <Table.Cell>
                    {request.payment_id && (
                      <Label as="a" color="blue" ribbon>
                        Pagado
                          </Label>
                    )}
                    {request._id}
                  </Table.Cell>
                  <Table.Cell>
                    <div
                      className={`color-circle ${getColorByValue(
                        request.color_type
                      )}`}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {
                      materialsList.find(
                        x => x.value === request.material_type
                      ).text
                    }
                  </Table.Cell>
                  <Table.Cell>
                    {moment(request.create_date).format("DD/MM/YYYY hh:mm")}
                  </Table.Cell>
                  <Table.Cell>
                    {
                      requestStatesList.find(x => x.value === request.status)
                        .text
                    }
                  </Table.Cell>
                  <Table.Cell style={{ textAlign: "center" }}>
                    {(request.price && request.price.amount && (
                      <Label.Group tag>
                        <Label style={{ marginTop: "5px" }} as="a">
                          ${request.price.amount}
                        </Label>
                      </Label.Group>
                    )) ||
                      ""}
                  </Table.Cell>
                  <Table.Cell>
                    {request.status === REQUESTS_STATUS_PRINTING ? (
                      <Countdown date={Date.now() + pendingMinutes * 60000} />
                    ) : null}
                  </Table.Cell>
                  <Table.Cell style={{ textAlign: "center" }}>
                    <ActionButtons
                      request={request}
                      authUser={this.props.authUser}
                      handleQuoteRequest={this.props.handleQuoteRequest}
                      handleAcceptQuote={this.props.handleAcceptQuote}
                      handleRejectQuote={this.props.handleRejectQuote}
                      handleStartPrinting={this.props.handleStartPrinting}
                      handleFinishPrinting={this.props.handleFinishPrinting}
                      handlePayRequest={this.props.handlePayRequest}
                      handleCancelRequest={this.props.handleCancelRequest}
                      pendingMinutes={this.props.pendingMinutes}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <a href={request.file_name} target="_blank">
                      Descargar
                        </a>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Pagination
          style={styles.paginator}
          defaultActivePage={1}
          ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
          firstItem={{ content: <Icon name='angle double left' />, icon: true }}
          lastItem={{ content: <Icon name='angle double right' />, icon: true }}
          prevItem={{ content: <Icon name='angle left' />, icon: true }}
          nextItem={{ content: <Icon name='angle right' />, icon: true }}
          totalPages={this.pagination.totalPages}
          onPageChange={this.changePage.bind(this)} />
      </div>
    );
  }
}
