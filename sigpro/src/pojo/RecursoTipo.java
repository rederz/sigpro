package pojo;
// Generated Dec 27, 2016 7:02:33 PM by Hibernate Tools 5.2.0.CR1

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * RecursoTipo generated by hbm2java
 */
@Entity
@Table(name = "recurso_tipo", catalog = "sigpro")
public class RecursoTipo implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1440246447873763085L;
	private Integer id;
	private String nombre;
	private String descripcion;
	private String usuarioCreo;
	private Integer usuarioActualizacion;
	private Date fechaCreacion;
	private Date fechaActualizacion;
	private int estado;
	private Set<RectipoPropiedad> rectipoPropiedads = new HashSet<RectipoPropiedad>(0);
	private Set<Recurso> recursos = new HashSet<Recurso>(0);

	public RecursoTipo() {
	}

	public RecursoTipo(String nombre, String usuarioCreo, Date fechaCreacion, int estado) {
		this.nombre = nombre;
		this.usuarioCreo = usuarioCreo;
		this.fechaCreacion = fechaCreacion;
		this.estado = estado;
	}

	public RecursoTipo(String nombre, String descripcion, String usuarioCreo, Integer usuarioActualizacion,
			Date fechaCreacion, Date fechaActualizacion, int estado, Set<RectipoPropiedad> rectipoPropiedads,
			Set<Recurso> recursos) {
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.usuarioCreo = usuarioCreo;
		this.usuarioActualizacion = usuarioActualizacion;
		this.fechaCreacion = fechaCreacion;
		this.fechaActualizacion = fechaActualizacion;
		this.estado = estado;
		this.rectipoPropiedads = rectipoPropiedads;
		this.recursos = recursos;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)

	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "nombre", nullable = false, length = 1000)
	public String getNombre() {
		return this.nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	@Column(name = "descripcion", length = 4000)
	public String getDescripcion() {
		return this.descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	@Column(name = "usuario_creo", nullable = false, length = 30)
	public String getUsuarioCreo() {
		return this.usuarioCreo;
	}

	public void setUsuarioCreo(String usuarioCreo) {
		this.usuarioCreo = usuarioCreo;
	}

	@Column(name = "usuario_actualizacion")
	public Integer getUsuarioActualizacion() {
		return this.usuarioActualizacion;
	}

	public void setUsuarioActualizacion(Integer usuarioActualizacion) {
		this.usuarioActualizacion = usuarioActualizacion;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "fecha_creacion", nullable = false, length = 19)
	public Date getFechaCreacion() {
		return this.fechaCreacion;
	}

	public void setFechaCreacion(Date fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "fecha_actualizacion", length = 19)
	public Date getFechaActualizacion() {
		return this.fechaActualizacion;
	}

	public void setFechaActualizacion(Date fechaActualizacion) {
		this.fechaActualizacion = fechaActualizacion;
	}

	@Column(name = "estado", nullable = false)
	public int getEstado() {
		return this.estado;
	}

	public void setEstado(int estado) {
		this.estado = estado;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "recursoTipo")
	public Set<RectipoPropiedad> getRectipoPropiedads() {
		return this.rectipoPropiedads;
	}

	public void setRectipoPropiedads(Set<RectipoPropiedad> rectipoPropiedads) {
		this.rectipoPropiedads = rectipoPropiedads;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "recursoTipo")
	public Set<Recurso> getRecursos() {
		return this.recursos;
	}

	public void setRecursos(Set<Recurso> recursos) {
		this.recursos = recursos;
	}

}