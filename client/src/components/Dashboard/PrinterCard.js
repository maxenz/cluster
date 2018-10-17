import React from 'react';
import {Card, Icon, Statistic, Label} from 'semantic-ui-react';
import Countdown from 'react-countdown-now';

const styles = {
  printerCardsContainer: {
    marginTop: '5%',
    marginLeft: '5%',
  },
  cardIcon: {
    float: 'right',
    fontSize: '1.5em',
  },
  statisticValue: {
    fontSize: '3rem!important',
    color: '#f2711c',
  },
  cardValue: {
    marginTop: '-10px',
  }
};

const PrinterCard = (props) =>
    <div style={styles.printerCardsContainer}>
      <Card>
        <Card.Content>
          <Icon name='print' style={styles.cardIcon}/>
          <Card.Header>
            Impresora {props.info.printer.name}
          </Card.Header>
          <Card.Meta>
            {
              props.info.pendingMinutes > 0 ?
                  <div>
                    <span>Libre en: </span>
                    <Countdown date={Date.now() + (props.info.pendingMinutes * 60000)}/>
                  </div> :
                  <Label color="orange" style={{marginTop: '5px'}}>
                    Libre
                  </Label>
            }

          </Card.Meta>
          {
            props.info.actualRequest ?
                <Card.Description>
                  Actualmente se está imprimiendo el archivo <strong>{props.info.actualRequest.file_name}</strong>
                </Card.Description> : null
          }
        </Card.Content>
        <Card.Content extra>
          <Statistic.Group style={{height: '77px'}}>
            <Statistic style={styles.cardValue}>
              <Statistic.Value style={styles.statisticValue}>0</Statistic.Value>
              <Statistic.Label>Imp. en cola</Statistic.Label>
            </Statistic>

            <Statistic style={styles.cardValue}>
              <Statistic.Value style={styles.statisticValue}>{props.info.reqMade}</Statistic.Value>
              <Statistic.Label>Imp. realizadas</Statistic.Label>
            </Statistic>

          </Statistic.Group>
        </Card.Content>
      </Card>
    </div>;

export default PrinterCard;