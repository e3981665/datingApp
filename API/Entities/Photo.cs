using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public Member Member { get; set; } = null!;
    public string MemberId { get; set; } = null!;


}
