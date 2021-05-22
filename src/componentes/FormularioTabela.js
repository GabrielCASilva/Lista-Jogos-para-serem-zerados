import React, { useState, useEffect }  from 'react';
import instanciaAxios from '../ajax/instanciaAxios';
import moment from 'moment';
import '../Tabela.css'
import '../Formulario.css'

const Titulo = () => {
    return(
        <h3>
            Preencha os dados abaixo com um jogo que
            você pretende zerar
        </h3>
    );
}

const ListaJogos = () => {

    const [listaCategoriasJogos, setListaCategoriasJogos] = useState([]);
    const [itensTabela, setItensTabela] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [alerta, setAlerta] = useState([]);
    

    const [novoNomeJogoTabela, setNovoNomeJogoTabela] = useState('');
    const [novaCategoriaJogoTabela, setNovaCategoriaJogoTabela] = useState('');
    const [novaDataFinalizarTabela, setNovaDataFinalizarTabela] = useState('');
    const [novoEstiloDeJogoCategoria, setNovoEstiloDeJogoCategoria] = useState('');
    const [novoEstilo, setNovoEstilo] = useState('');
    const [novoTurno, setNovoTurno] = useState('');
    const [novoAlerta, setNovoAlerta] = useState('');

    useEffect(() => {
        getCategoriasJogos();
        getItemTabela();
        getTurnos();
        getAlerta();
    }, [])

    const getAlerta = async () => {
        try {
            const resposta = await instanciaAxios.get('../json/alerta.json');
            setAlerta(resposta.data.alerta);
        } catch(error) {
            console.log(error.message)
        }
    }

    const getCategoriasJogos = async () => {
        try {
            const resposta = await instanciaAxios.get('../json/categorias.json');
            setListaCategoriasJogos(resposta.data.categoriasJogos);
        } catch(error) {
            console.log(error.message);
        }
    }

    const getItemTabela = async () => {

        try{
            const resposta = await instanciaAxios.get('../json/afazer.json');
            setItensTabela(resposta.data.afazer);
        }catch (error) {
            console.log(error.message);
        }
    };

    const getTurnos = async () => {
        try {
            const resposta = await instanciaAxios.get('../json/turnos.json');
            setTurnos(resposta.data.turnos);

        } catch (error) {
            console.log(error.message)
        }

    }

    

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////COLOCANDO NA TELA//////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    const AlertaComponente = (props) => {
        if(alerta.length > 0){
            return alerta.map((item , i) => {
                if(props.status === "ligado"){
                    return(
                        <img  key={i} alt='' src={item.url} className="sino"></img>
                    )
                }else{
                    return null               
                }
            })
        }else{
            return null
        }
    }

    const OpcoesTurnoComponente = () => {
        if(turnos.length > 0){
            return turnos.map( ( item, i ) => {
                return(
                    <div key={i}  className="turnos">
                        <label htmlFor={item.id} name="turnos"  className="turnos-indicador">
                        {item.turno}</label>
                        <input key={item.id} id={item.id} name="turnos" value={item.id} type="radio"
                        className="turnos-input"
                        onChange={ (e) => setNovoTurno( e.target.value )}
                        checked={item.id === novoTurno}/>
                    </div>
                )
            })

        }else{
            return null
        }
    }

    const OpcoesListaJogosComponente = () => {

        if(listaCategoriasJogos.length > 0 ){
            
            return listaCategoriasJogos.map( (item) => {
                return (
                    <option key={item.id} value={item.id}>
                        {item.descricao}
                    </option>
                );
            });

        }else{
            return null;
        }
    };

    const CorpoItensTabelaComponente = () => {

        if( itensTabela.length > 0 ){
            return (
                <tbody className="tabela-corpo">
                    { itensTabela.map( (item) => {
                                return (
                                    <LinhaTabelaComponente 
                                        key={item.id}
                                        id={item.id}
                                        nome={item.nome}
                                        estilo={item.idEstilo}
                                        alerta={item.alerta}
                                        data={item.data}
                                        turno={item.turnos}/>
                                )
                            }
                        )
                    }
                </tbody>
            );
        }else{
            return null;
        }
    };

    const LinhaTabelaComponente = (props) => {

        let categoriaTurno = null
        categoriaTurno = turnos ? turnos.find( (item) => {
            return item.id === props.turno
        }) : null;


        let categoriaJogosTabela = null
        categoriaJogosTabela = listaCategoriasJogos ? listaCategoriasJogos.find( (item) => {
            return item.id === props.estilo
        }) : null;

        let data = moment(props.data)

        return (
            
            <tr>
                <td>{props.nome}
                    <AlertaComponente status={props.alerta}/></td>
                <td>{categoriaJogosTabela ? categoriaJogosTabela.descricao : null}</td>
                <td>{data.format('DD/MM/YYYY')}</td>
                <td>{categoriaTurno ? categoriaTurno.turno : null}</td>
                <td onClick={() => { removerTarefa( props.id) }}>
                    <img alt="lixeira" className="lixeira" src='../imagens/lixeira.png'></img></td>
            </tr>
        )
    }

    const adicionarEstiloJogoCategoria = () => {

        if(novoEstiloDeJogoCategoria && listaCategoriasJogos && novoEstiloDeJogoCategoria !== novoEstilo){
                
            const novoEstiloObj = {
                "id" : JSON.stringify(listaCategoriasJogos.length + 1),
                "descricao" : novoEstiloDeJogoCategoria
            }

            setListaCategoriasJogos([...listaCategoriasJogos, novoEstiloObj])

            
        }else{
            return null
        }

        setNovoEstilo(novoEstiloDeJogoCategoria)
    }

    const removerTarefa = (i) => {
        const _itensTabela = itensTabela.filter( (item) => {
            return item.id !== i
        })

        return setItensTabela(_itensTabela)
    }
    

    const adicionarItemTabela = () => {
        

        if( novaCategoriaJogoTabela > 0 && novoNomeJogoTabela && novaDataFinalizarTabela && novoTurno){
            adicionarEstiloJogoCategoria()


            let idUltimo = 0

            if(itensTabela.length){
                const indiceUltimo = itensTabela.length - 1
                const ultimo = itensTabela[indiceUltimo]
                idUltimo = ultimo.id
            }

            const novoItem = parseInt(idUltimo) + 1
            

            const novoItemObj = {
                "id" : novoItem,
                "nome": novoNomeJogoTabela,
                "data": novaDataFinalizarTabela,
                "alerta" : novoAlerta,
                "idEstilo": novaCategoriaJogoTabela,
                "turnos" : novoTurno
            }

            setItensTabela( [...itensTabela, novoItemObj] )
            limparCampos()


        }else{
            alert('Por favor, preencha os campos "Nome", "Previsão", "Estilo" e "Turno"')
        }
  
    }

    const limparCampos = () =>{
        setNovoNomeJogoTabela('');
        document.getElementById("nome").value = null
        setNovaCategoriaJogoTabela('');
        setNovaDataFinalizarTabela('');
        document.getElementById("data-formulario").value = null
        setNovoEstiloDeJogoCategoria('');
        document.getElementById("adicionar-novo").value = null
        setNovoTurno('');
        setNovoAlerta("desligado");
        document.getElementById("alerta").checked = 0
    }

    return (
        <>
            <div className="formulario">
                <Titulo/>

                <div className="envolve-conteudo-formulario">
                    
                    <div className="nome-data">
                        <div className="envolve-nome">
                            <label htmlFor="nome" >Nome do Jogo</label>
                            <input type="text" id="nome" size="35" 
                                placeholder="Nome do jogo" 
                                onChange={ (e) => setNovoNomeJogoTabela(e.target.value) }/>
                        </div>
                       
                        <div className="envolve-data">
                            <label>Previsão</label>
                            <input type="date" id="data-formulario"
                            onChange={ (e) => setNovaDataFinalizarTabela(e.target.value)}/>
                        </div>

                        <div className="alerta">
                            <label htmlFor="alerta" className="alerta">Ligar alerta</label>
                            <input id="alerta" type="checkbox"
                            onChange={ () => setNovoAlerta( novoAlerta === "ligado" ? "desligado" : "ligado")}/>                        
                        </div>
                        
                    </div>
                   
                    <div className="lista-adicao">

                        <label htmlFor="categoria ">Estilo de Jogos: </label>

                        <select className="jogos-opcoes" 
                            name="categoria"
                            onChange={ (e) => setNovaCategoriaJogoTabela(e.target.value )}
                            value={novaCategoriaJogoTabela}>
                            <option value={-1}>Selecione</option>
                            <OpcoesListaJogosComponente />
                        </select>
                        
                        <label>Algum estilo de jogo que queira adicionar a lista?</label>
                        <input type="text" id="adicionar-novo"
                            placeholder="Digite o estilo do jogo para ele ser adicionado a lista"
                            onChange={(e) => setNovoEstiloDeJogoCategoria(e.target.value)}/>
                    </div>

                    <p>Em qual turno você estará disponível para jogar?</p>
                    <div className="turnos-conjunto">
                        <OpcoesTurnoComponente/>
                    </div>
                    

                    <div className="envolve-btn">
                        <button className="btn-criar"
                            onClick={  () => { adicionarItemTabela() } }
                        >Adicionar a tebela!</button>
                    </div>
                </div>   
            </div>
            
            <table className="tabela">        
                    <thead className="tabela-header">
                        <tr>
                            <th>Nome do jogo</th>
                            <th>Estilo de Jogo</th>
                            <th>Data pretendida</th>
                            <th>Tempo livre</th>
                            <th>Ações</th>
                            
                        </tr>
                    </thead>
                    
                    <CorpoItensTabelaComponente/>
                    <tfoot>
                        <tr>
                            <td colSpan='5'> Total={itensTabela.length}</td>
                        </tr>
                    </tfoot>
            </table>
        </>
    );
}




export default function FormularioTabela () {
    return (
        <>
            <ListaJogos />
        </>
    )
}