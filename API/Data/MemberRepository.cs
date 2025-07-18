using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await context.Members.ToListAsync();
    }

    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId)
    {
        return await context.Members.Where(m => m.Id == memberId)
            .SelectMany(m => m.Photos)
            .ToListAsync();
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members.Include(m => m.User).Include(m => m.Photos).SingleOrDefaultAsync(m => m.Id == id);
    }
}
