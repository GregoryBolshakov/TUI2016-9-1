var Cell = React.createClass({
    getInitialState: function() {
        return {
            cell_type: 0,
            default_cell_type: 0
        }
    },
    isFree: function() {
        var type = this.state.default_cell_type;
        return (type != 1 && type != 2 && type != 4 && type != 6 && type != 8 && type != 9 && type != 10);
    },
    possibleMove: function(player) {
        var id = this.props.id,
            cir = this.props.parent.props.cells_in_row,
            row = (Math.trunc(id / cir) & 1) * 2 - 1,
            num = this.props.parent.props.cells.length,
            type = this.state.default_cell_type;
        if (this.samePlayer(player)) return 0;
        if (id >= 2 * cir &&
            this.props.parent.props.cells[id - 2 * cir].nearAllies(player) &&
            this.props.parent.props.cells[id - 2 * cir].isFree()) return 1;
        if (id + 2 * cir < num &&
            this.props.parent.props.cells[id + 2 * cir].nearAllies(player) &&
            this.props.parent.props.cells[id + 2 * cir].isFree()) return 1;
        if (id >= cir  &&
            this.props.parent.props.cells[id - cir].nearAllies(player) &&
            this.props.parent.props.cells[id - cir].isFree()) return 1;
        if (id + cir < num &&
            this.props.parent.props.cells[id + cir].nearAllies(player) &&
            this.props.parent.props.cells[id + cir].isFree()) return 1;
        if (id >= cir - row &&
            id % cir + row < cir &&
            id % cir + row >= 0 &&
            this.props.parent.props.cells[id - cir + row].nearAllies(player) &&
            this.props.parent.props.cells[id - cir + row].isFree()) return 1;
        if (id + cir + row < num &&
            id % cir + row < cir &&
            id % cir + row >= 0 &&
            this.props.parent.props.cells[id + cir + row].nearAllies(player) &&
            this.props.parent.props.cells[id + cir + row].isFree()) return 1;
        return 0;
    },
    componentWillMount: function() {
        this.setState({cell_type: this.props.default_cell_type, default_cell_type: this.props.default_cell_type});
        this.props.parent.props.cells.push(this);
    },
    samePlayer: function(player) {
        var type = this.state.default_cell_type;
        if (player && type != 7 && type != 8 && type != 10) return 0;
        if (!player && type != 5 && type != 6 && type != 9) return 0;
        return 1;
    },
    assignCell: function (isFort, play) {
        var player = play * 2, type = this.state.default_cell_type, player_belong = 2,
            count = this.props.parent.state.count;
        if (type == 5 || type == 6 || type == 9) player_belong = 0;
        if (type == 7 || type == 8 || type == 10) player_belong = 1;
        count[player / 2]++;
        count[player_belong]--;
        this.props.parent.setState({count: count});
        if (type == 2 || type == 4 || type == 6 || type == 8 || isFort) type = 6 + player;
        else if (type == 1 || type == 9 || type == 10) type = 9 + player / 2;
        else type = 5 + player;
        this.setState({cell_type: type, default_cell_type: type});
    },
    nearAllies: function(player) {
        var id = this.props.id,
            cir = this.props.parent.props.cells_in_row,
            row = (Math.trunc(id / cir) & 1) * 2 - 1,
            num = this.props.parent.props.cells.length;
        if (this.samePlayer(player)) return 1;
        if (id >= 2 * cir && this.props.parent.props.cells[id - 2 * cir].samePlayer(player)) return 1;
        if (id + 2 * cir < num && this.props.parent.props.cells[id + 2 * cir].samePlayer(player)) return 1;
        if (id >= cir  && this.props.parent.props.cells[id - cir].samePlayer(player)) return 1;
        if (id + cir < num && this.props.parent.props.cells[id + cir].samePlayer(player)) return 1;
        if (id >= cir - row && id % cir + row < cir && id % cir + row >= 0 && this.props.parent.props.cells[id - cir + row].samePlayer(player)) return 1;
        if (id + cir + row < num && id % cir + row < cir && id % cir + row >= 0 && this.props.parent.props.cells[id + cir + row].samePlayer(player)) return 1;
        return 0;
    },
    buildFortress: function(first, play) {
        var id = this.props.id,
            cir = this.props.parent.props.cells_in_row,
            row = (Math.trunc(id / cir) & 1) * 2 - 1,
            num = this.props.parent.props.cells.length,
            player = play,
            spec = !isNaN(player),
            usedCells = [];
        if (!spec) player = this.props.parent.state.player;
        if (!first && !this.nearAllies(player)) return 0;
        this.assignCell(1, player);
        usedCells.push(id);
        if (id >= 2 * cir) {
            this.props.parent.props.cells[id - 2 * cir].assignCell(0, player);
            usedCells.push(id - 2 * cir);
        }
        if (id + 2 * cir < num) {
            this.props.parent.props.cells[id + 2 * cir].assignCell(0, player);
            usedCells.push(id + 2 * cir);
        }
        if (id >= cir) {
            this.props.parent.props.cells[id - cir].assignCell(0, player);
            usedCells.push(id - cir);
        }
        if (id + cir < num) {
            this.props.parent.props.cells[id + cir].assignCell(0, player);
            usedCells.push(id + cir);
        }
        if (id >= cir - row && id % cir + row < cir && id % cir + row >= 0) {
            this.props.parent.props.cells[id - cir + row].assignCell(0, player);
            usedCells.push(id - cir + row);
        }
        if (id + cir + row < num && id % cir + row < cir && id % cir + row >= 0) {
            this.props.parent.props.cells[id + cir + row].assignCell(0, player);
            usedCells.push(id + cir + row);
        }
        if (!spec) this.props.parent.nextMove(usedCells);
        return 1;
    },
    makeSelected: function() {
        var type = this.state.cell_type, player = this.props.parent.state.player;
        if (type == 0 || type == 5 || type == 7) this.setState({cell_type: 3});
        if (type == 3) return this.buildFortress(0);
        return 0;
    },
    makeDeselected: function() {
        this.setState({cell_type: this.state.default_cell_type});
    },
    handleClick: function () {
        var id = this.props.id, lst = this.props.parent.props.selected_cell, isSet = this.makeSelected();
        if (lst != id) {
            if (lst != null) this.props.parent.props.cells[lst].makeDeselected();
            this.props.parent.props.selected_cell = id;
        } else if (isSet) this.props.parent.props.selected_cell = null;
    },
    render: function() {
        var imgsrc = "img/cell_type" + this.state.cell_type + ".png";
        var style = {
            marginRight: this.props.width * (Math.sqrt(3) - 1)
        };
        return (
            <div className="Cell" style={ style } onClick={ this.handleClick }>
                <img src={ imgsrc } width={ this.props.width } />
            </div>
        )
    },
    componentDidMount: function() {
        var num = this.props.parent.props.cells.length;
        if (this.props.id == num - 1) {
            var num1 = Math.trunc(Math.random() * num), num2 = Math.trunc(Math.random() * num);
            var cell = this.props.parent.props.cells[num1];
            cell.buildFortress(1, 0);
            cell = this.props.parent.props.cells[num2];
            cell.buildFortress(1, 1);
        }
    }
});

var ResultTable = React.createClass({
    getInitialState: function() {
        return {
            isEnded: false
        }
    },
    finishGame: function() {
        this.setState({isEnded: true});
    },
    transformText: function(text) {
        var ans = [];
        var colors = ["green", "red", "blue", "brown", "purple", "orange"];
        for (var i = 0; i < text.length; i++) {
            var r = Math.trunc(Math.random() * colors.length);
            ans.push(<span style={{ color: colors[r] }}>{ text[i] }</span>);
        }
        return <i>{ ans }</i>;
    },
    render: function() {
        var txt = "Waiting for player " + (this.props.parent.state.player + 1);
        var elem = [];
        if (this.state.isEnded) {
            elem.push(<div className="prettyButton"><a href="main.html">New game</a></div>);
            var txt = this.props.parent.state.count[0] == this.props.parent.state.count ?
                "It's a tie." : (this.props.parent.state.count[0] > this.props.parent.state.count[1] ?
                "First" : "Second") + " player wins.";
        }
        return (
            <div>
                <h1>Count: { (this.props.parent.state.count[0]) + " : " + (this.props.parent.state.count[1]) }</h1>
                <h2 color="yellow">{ this.transformText(txt) }</h2>
                { elem }
            </div>
        )
    },
    componentDidMount: function() {
        this.props.parent.props.result = this;
    }
});

var Map = React.createClass({
    getRandomCellType: function(fr) {
        var sum = 0;
        for (var i = 0; i < fr.length; i++) sum += fr[i];
        var x = Math.trunc(Math.random() * sum), i = 0;
        while (x >= fr[i])
        {
            x -= fr[i];
            i++;
        }
        return i;
    },
    getDefaultProps: function() {
        return {
            cell_heigth: 0,
            selected_cell: null,
            cells: [],
            result: null
        }
    },
    getInitialState: function() {
        return {
            player: 0,
            count: [0, 0, 0],
            map_style: {
                WebkitFilter: '',
                marginTop: 0
            },
            problems: 0
        }
    },
    cantMove: function(player, usedCells) {
        function isInside(value, array) {
            for (var i = 0; i < array.length; i++) if (array[i] == value) return 1;
            return 0;
        }
        for (var i = 0; i < this.props.cells.length; i++) if (!isInside(i, usedCells) && this.props.cells[i].possibleMove(player)) {
            return 0;
        }
        return 1;
    },
    nextMove: function(usedCells) {
        var player = this.state.player ^ 1, problem = this.state.problems;
        if (problem == 1) player = 1;
        if (problem == 2) player = 0;
        if (this.state.count[1] && this.cantMove(player, usedCells)) {
            if ((problem == 2 && !player) || (problem == 1 && player)) this.props.result.finishGame();
            if (player && !problem) {
                problem = 2;
                player = 0;
            }
            if (!player && !problem) {
                problem = 1;
                player = 1;
            }

        }
        this.setState({player: player, problems: problem});
    },
    componentWillMount: function() {
        this.props.cell_height = this.props.cell_width * Math.sqrt(3) / 2;
        var st = this.state.map_style;
        st.marginTop = this.props.cell_height / 2;
        this.setState({map_style: st});
    },
    render: function() {
        var even_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * this.props.cells_in_row,
            marginTop: -this.props.cell_height / 2
        };
        var odd_row_style = {
            width: (this.props.cell_width * Math.sqrt(3)) * this.props.cells_in_row,
            marginTop: -this.props.cell_height / 2,
            marginLeft: this.props.cell_width * Math.sqrt(3) / 2
        };

        // -------------------------------------------------------------------------------------------------------------

        var cells = [];
        for (var i = 0; i < this.props.number_of_rows; i++) {
            var cells_row = [];
            for (var j = 0; j < this.props.cells_in_row; j++)
                cells_row.push(<Cell width={ this.props.cell_width }
                                     default_cell_type={ this.getRandomCellType([3, 1]) }
                                     parent={ this }
                                     id={ j + i * this.props.cells_in_row } />);
            if (i & 1) cells.push(<div style={odd_row_style}
                                       className="cells_row">{ cells_row }</div>);
            else cells.push(<div style={even_row_style}
                                 className="cells_row">{ cells_row }</div>);
        }

        // -------------------------------------------------------------------------------------------------------------

        return (
            <div className="Map" style={ this.state.map_style }>
                { cells }
                <ResultTable parent={ this } />
            </div>
        )
    }
});

React.render(<Map cell_width={70} cells_in_row={5} number_of_rows={6} />, document.getElementById('react1'));