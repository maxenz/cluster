import React from 'react'
import { Segment, Statistic, Label } from 'semantic-ui-react'

const style = {
  segment: {
    marginTop: '7%',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  statistics: {
    width: '90%',
  }
};

const MaterialSemanalUse = (props) => (
    <Segment style={style.segment}>
      <Label as='a' color='orange' ribbon='right'>
        Uso semanal de materiales en CM.
      </Label>
      <Statistic.Group widths='three' style={style.statistics}>
        <Statistic>
          <Statistic.Value>{props.uses[0]}</Statistic.Value>
          <Statistic.Label>ABS</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>{props.uses[1]}</Statistic.Value>
          <Statistic.Label>FLEX</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>{props.uses[2]}</Statistic.Value>
          <Statistic.Label>FLA</Statistic.Label>
        </Statistic>

      </Statistic.Group>
    </Segment>
);

export default MaterialSemanalUse